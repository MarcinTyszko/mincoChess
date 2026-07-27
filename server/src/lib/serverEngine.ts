import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { createInterface, Interface } from "readline";
import cluster from "cluster";
import os from "os";
import { Chess } from "chess.js";

import { EngineLine } from "shared/types/game/position/EngineLine";
import EngineVersion from "shared/constants/EngineVersion";

const stockfishPath = process.env.STOCKFISH_PATH || "stockfish";

// The server runs one cluster worker per core (see index.ts), and each
// worker owns its own engine pool. The engine budget below is therefore a
// GLOBAL target for the whole server that we divide across the workers, so
// the total number of Stockfish processes stays bounded instead of being
// (cores x poolSize) as it would be with a per-worker cap.
const clusterWorkerCount = cluster.isWorker
    ? Math.max(1, os.cpus().length)
    : 1;

// Evaluating many positions scales better across engine processes
// than across threads of a single search
const globalEngineBudget = Number(process.env.SERVER_ENGINE_PROCESSES)
    || Math.min(4, Math.max(1, Math.floor(os.cpus().length / 3)));

export const enginePoolSize = Math.max(
    1, Math.round(globalEngineBudget / clusterWorkerCount)
);

// Total Stockfish processes the whole server may run at once, used to size
// the per-engine thread count so we don't oversubscribe the CPU
const totalEngineProcesses = clusterWorkerCount * enginePoolSize;

// Slightly undersubscribe: os.cpus() counts SMT threads, and Stockfish
// gains little from hyperthread oversubscription
const engineThreads = Number(process.env.SERVER_ENGINE_THREADS)
    || Math.max(1, Math.floor(os.cpus().length / totalEngineProcesses));

const engineHashMegabytes = Number(process.env.SERVER_ENGINE_HASH) || 128;

// Terminate an engine that has sat idle in the pool for this long, so an
// idle server releases its Stockfish processes (and their memory) instead
// of holding them resident forever
const engineIdleTimeoutMs = Number(process.env.SERVER_ENGINE_IDLE_MS) || 60_000;

// Guard rails so a wedged or dead engine can never permanently occupy a
// pool slot or hang a request
const engineReadyTimeoutMs
    = Number(process.env.SERVER_ENGINE_READY_MS) || 15_000;
const engineEvaluateTimeoutMs
    = Number(process.env.SERVER_ENGINE_EVAL_MS) || 120_000;

// How long to wait for a graceful `quit`/SIGTERM before forcing SIGKILL
const engineKillGraceMs
    = Number(process.env.SERVER_ENGINE_KILL_GRACE_MS) || 2_000;

// Convert UCI evaluation types to our ones
const uciEvaluationTypes: Record<string, "centipawn" | "mate" | undefined> = {
    cp: "centipawn",
    mate: "mate"
};

export interface ServerEvaluationOptions {
    depth: number;
    lines: number;
    /** Per-position time limit in milliseconds */
    timeLimit?: number;
}

/**
 * @description A native Stockfish process talking UCI, producing engine
 * lines in exactly the same format as the client-side WASM engines so
 * that the report pipeline treats both identically.
 */
export class ServerEngine {
    private process: ChildProcessWithoutNullStreams;
    private lineReader: Interface;

    /** False once the underlying process has exited or been terminated */
    private alive = true;
    /** Ensures exit bookkeeping (and the exit callback) runs exactly once */
    private exited = false;
    /** Set while we are deliberately shutting the process down */
    private terminating = false;
    private killTimer?: NodeJS.Timeout;
    private exitCallback?: () => void;

    constructor() {
        this.process = spawn(stockfishPath);
        this.lineReader = createInterface({ input: this.process.stdout });

        // Without these, a spawn failure (e.g. missing binary) or an EPIPE
        // from writing to an engine that just died would surface as an
        // unhandled 'error' event and crash the whole worker — taking its
        // other engines down with it and orphaning their child processes.
        this.process.on("error", () => this.handleExit());
        this.process.stdin.on("error", () => { /* engine gone; ignore */ });
        this.process.once("exit", () => this.handleExit());

        this.send("uci");
        this.send(`setoption name Threads value ${engineThreads}`);
        this.send(`setoption name Hash value ${engineHashMegabytes}`);
    }

    /** Register a one-shot callback fired when the process exits for any reason */
    onExit(callback: () => void) {
        if (this.exited) return callback();
        this.exitCallback = callback;
    }

    get isAlive() {
        return this.alive;
    }

    private send(command: string) {
        // Writing to a dead or closing engine would throw/EPIPE; skip it
        if (!this.alive || !this.process.stdin.writable) return;

        this.process.stdin.write(command + "\n");
    }

    /** Runs once, whether the exit was expected (terminate) or a crash */
    private handleExit() {
        this.alive = false;

        if (this.exited) return;
        this.exited = true;

        if (this.killTimer) {
            clearTimeout(this.killTimer);
            this.killTimer = undefined;
        }

        this.lineReader.removeAllListeners();
        this.lineReader.close();

        this.exitCallback?.();
    }

    /**
     * @description Idempotently shut the engine down: ask Stockfish to quit
     * cleanly, then SIGTERM, escalating to SIGKILL if it ignores us. Safe to
     * call multiple times and safe to call on an already-dead engine.
     */
    terminate() {
        if (this.terminating) return;
        this.terminating = true;

        if (!this.alive) return this.handleExit();

        // Stop any running search and let Stockfish exit on its own first
        this.send("stop");
        this.send("quit");

        this.process.kill("SIGTERM");

        // Force-kill if the process is still around after the grace period
        this.killTimer = setTimeout(() => {
            if (this.alive) this.process.kill("SIGKILL");
        }, engineKillGraceMs);
        this.killTimer.unref?.();
    }

    /** Synchronous, unconditional kill for process-exit shutdown handlers */
    killNow() {
        this.terminating = true;
        try {
            this.process.kill("SIGKILL");
        } catch { /* already gone */ }
        this.handleExit();
    }

    /**
     * @description Wait until the engine confirms it is ready; also used
     * to detect a missing Stockfish binary early. Rejects on process error
     * or if the engine does not answer within the ready timeout.
     */
    ready() {
        return new Promise<void>((res, rej) => {
            if (!this.alive) return rej(new Error("engine is not alive"));

            const cleanup = () => {
                this.lineReader.off("line", onLine);
                this.process.off("error", onError);
                this.process.off("exit", onExit);
                clearTimeout(timer);
            };

            const onLine = (log: string) => {
                if (log.trim() != "readyok") return;

                cleanup();
                res();
            };

            const onError = (err: Error) => {
                cleanup();
                rej(err);
            };

            const onExit = () => {
                cleanup();
                rej(new Error("engine exited before becoming ready"));
            };

            const timer = setTimeout(() => {
                cleanup();
                rej(new Error("engine ready timeout"));
            }, engineReadyTimeoutMs);
            timer.unref?.();

            this.lineReader.on("line", onLine);
            this.process.once("error", onError);
            this.process.once("exit", onExit);

            this.send("isready");
        });
    }

    async evaluate(
        fen: string,
        options: ServerEvaluationOptions
    ): Promise<EngineLine[]> {
        this.send(`setoption name MultiPV value ${options.lines}`);
        this.send(`position fen ${fen}`);

        const engineLines: EngineLine[] = [];

        const timeLimitArgument = options.timeLimit
            ? ` movetime ${options.timeLimit}` : "";

        // Never wait forever for a `bestmove`: a crashed or wedged engine
        // would otherwise leave this promise (and its pool slot) hung
        const evaluateTimeoutMs = Math.max(
            engineEvaluateTimeoutMs, (options.timeLimit ?? 0) + 10_000
        );

        return new Promise((res, rej) => {
            if (!this.alive) return rej(new Error("engine is not alive"));

            const cleanup = () => {
                this.lineReader.off("line", listener);
                this.process.off("error", onError);
                this.process.off("exit", onExit);
                clearTimeout(timer);
            };

            const onError = (err: Error) => {
                cleanup();
                rej(err);
            };

            const onExit = () => {
                cleanup();
                rej(new Error("engine exited during evaluation"));
            };

            const timer = setTimeout(() => {
                cleanup();
                rej(new Error("engine evaluation timeout"));
            }, evaluateTimeoutMs);
            timer.unref?.();

            const listener = (log: string) => {
                parseInfoLine(log);

                // Depth 0 is given for terminal states (mate/stalemate);
                // its info line must still be parsed above, as it carries
                // the position's only evaluation
                if (
                    log.startsWith("bestmove")
                    || log.includes("depth 0")
                ) {
                    cleanup();
                    res(engineLines);
                }
            };

            const parseInfoLine = (log: string) => {
                if (!log.startsWith("info depth")) return;
                if (log.includes("currmove")) return;

                const depth = parseInt(
                    log.match(/(?<= depth )\d+/)?.[0] || ""
                );
                if (isNaN(depth)) return;

                const index = parseInt(
                    log.match(/(?<= multipv )\d+/)?.[0] || ""
                ) || 1;

                const scoreMatches = log.match(/ score (cp|mate) (-?\d+)/);
                const evaluationType
                    = uciEvaluationTypes[scoreMatches?.[1] || ""];

                if (!evaluationType) return;

                let evaluationScore = parseInt(scoreMatches?.[2] || "");
                if (isNaN(evaluationScore)) return;

                // Make sure evaluations are always from White's view
                if (fen.includes(" b ")) {
                    evaluationScore = -evaluationScore;
                }

                const moveUcis
                    = log.match(/ pv (.*)/)?.at(1)?.split(" ") || [];

                // Convert UCI moves to SANs on a temp board; drop lines
                // with moves that fail to parse
                const moveSans: string[] = [];

                try {
                    const board = new Chess(fen);

                    for (const moveUci of moveUcis) {
                        moveSans.push(board.move(moveUci).san);
                    }
                } catch {
                    return;
                }

                engineLines.push({
                    depth: depth,
                    index: index,
                    evaluation: {
                        type: evaluationType,
                        value: evaluationScore
                    },
                    source: EngineVersion.SERVER_STOCKFISH,
                    moves: moveUcis.map((moveUci, moveIndex) => ({
                        uci: moveUci,
                        san: moveSans[moveIndex]
                    }))
                });
            };

            this.lineReader.on("line", listener);
            this.process.once("error", onError);
            this.process.once("exit", onExit);

            this.send(`go depth ${options.depth}${timeLimitArgument}`);
        });
    }
}

/**
 * @description Fixed-size pool of Stockfish processes shared by every
 * evaluation request within a worker. Waiters are served first come first
 * served, so several users evaluating at once each get an engine as soon as
 * one frees up, instead of every request spawning its own processes and
 * oversubscribing the CPU.
 *
 * Engines that sit idle past {@link engineIdleTimeoutMs} are terminated so
 * an unused server does not keep Stockfish processes (and their memory)
 * resident, and engines whose process dies unexpectedly are dropped from
 * the pool's bookkeeping so a dead engine is never handed out and a slot is
 * never permanently lost.
 */
class ServerEnginePool {
    private idle: ServerEngine[] = [];
    private idleTimers = new Map<ServerEngine, NodeJS.Timeout>();
    /** Every engine the pool is currently accounting for (busy or idle) */
    private live = new Set<ServerEngine>();
    private waiters: ((engine: ServerEngine) => void)[] = [];
    private shuttingDown = false;

    /** Wait for an engine; the wait queue is FIFO across requests */
    async acquire(): Promise<ServerEngine> {
        const engine = this.tryAcquire();
        if (engine) return engine;

        return new Promise(res => this.waiters.push(res));
    }

    /**
     * @description An idle or freshly spawned engine, or null when the
     * pool is at capacity; used to opportunistically parallelize a
     * request without starving other users.
     */
    tryAcquire(): ServerEngine | null {
        if (this.shuttingDown) return null;

        const idleEngine = this.idle.pop();
        if (idleEngine) {
            this.clearIdleTimer(idleEngine);
            return idleEngine;
        }

        if (this.live.size < enginePoolSize) return this.spawn();

        return null;
    }

    release(engine: ServerEngine) {
        // The engine may have died while checked out; if so, don't return a
        // corpse to the pool — just try to keep any waiter moving
        if (!this.live.has(engine) || !engine.isAlive) {
            this.forget(engine);
            return this.serveNextWaiter();
        }

        if (this.shuttingDown) return this.discard(engine);

        const waiter = this.waiters.shift();
        if (waiter) return waiter(engine);

        this.idle.push(engine);
        this.armIdleTimer(engine);
    }

    /** Remove a failed engine from the pool instead of releasing it */
    discard(engine: ServerEngine) {
        this.forget(engine);
        engine.terminate();

        // Hand a replacement to the next waiter, who would otherwise
        // wait for a release that may never come
        this.serveNextWaiter();
    }

    /** Terminate every engine (graceful); used on server shutdown */
    terminateAll() {
        this.shuttingDown = true;

        for (const engine of [...this.live]) {
            this.forget(engine);
            engine.terminate();
        }
    }

    /** Synchronous last-resort kill for process 'exit' handlers */
    killAllNow() {
        this.shuttingDown = true;

        for (const engine of [...this.live]) engine.killNow();

        this.live.clear();
        this.idle = [];
    }

    private spawn(): ServerEngine {
        const engine = new ServerEngine();
        this.live.add(engine);

        // When the OS process dies for any reason, stop accounting for it so
        // its slot is reclaimed and no dead engine lingers in the pool
        engine.onExit(() => {
            const wasTracked = this.live.has(engine);
            this.forget(engine);
            if (wasTracked && !this.shuttingDown) this.serveNextWaiter();
        });

        return engine;
    }

    /** Drop an engine from all bookkeeping (idempotent) */
    private forget(engine: ServerEngine) {
        this.live.delete(engine);
        this.clearIdleTimer(engine);

        const index = this.idle.indexOf(engine);
        if (index >= 0) this.idle.splice(index, 1);
    }

    private serveNextWaiter() {
        const waiter = this.waiters.shift();
        if (!waiter) return;

        const replacement = this.tryAcquire();

        if (replacement) return waiter(replacement);

        this.waiters.unshift(waiter);
    }

    private armIdleTimer(engine: ServerEngine) {
        const timer = setTimeout(() => {
            this.forget(engine);
            engine.terminate();
        }, engineIdleTimeoutMs);

        // Don't let idle engines keep the event loop (and process) alive
        timer.unref?.();

        this.idleTimers.set(engine, timer);
    }

    private clearIdleTimer(engine: ServerEngine) {
        const timer = this.idleTimers.get(engine);
        if (!timer) return;

        clearTimeout(timer);
        this.idleTimers.delete(engine);
    }
}

export const serverEnginePool = new ServerEnginePool();
