import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { createInterface, Interface } from "readline";
import os from "os";
import { Chess } from "chess.js";

import { EngineLine } from "shared/types/game/position/EngineLine";
import EngineVersion from "shared/constants/EngineVersion";

const stockfishPath = process.env.STOCKFISH_PATH || "stockfish";

// Evaluating many positions scales better across engine processes
// than across threads of a single search
export const enginePoolSize = Number(process.env.SERVER_ENGINE_PROCESSES)
    || Math.min(4, Math.max(1, Math.floor(os.cpus().length / 3)));

// Slightly undersubscribe: os.cpus() counts SMT threads, and Stockfish
// gains little from hyperthread oversubscription
const engineThreads = Number(process.env.SERVER_ENGINE_THREADS)
    || Math.max(1, Math.floor(os.cpus().length / enginePoolSize) - 1);

const engineHashMegabytes = Number(process.env.SERVER_ENGINE_HASH) || 128;

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

    constructor() {
        this.process = spawn(stockfishPath);
        this.lineReader = createInterface({ input: this.process.stdout });

        this.send("uci");
        this.send(`setoption name Threads value ${engineThreads}`);
        this.send(`setoption name Hash value ${engineHashMegabytes}`);
    }

    private send(command: string) {
        this.process.stdin.write(command + "\n");
    }

    terminate() {
        this.lineReader.removeAllListeners();
        this.process.kill();
    }

    /**
     * @description Wait until the engine confirms it is ready; also used
     * to detect a missing Stockfish binary early.
     */
    ready() {
        return new Promise<void>((res, rej) => {
            const listener = (log: string) => {
                if (log.trim() != "readyok") return;

                this.lineReader.off("line", listener);
                this.process.off("error", errorListener);
                res();
            };

            const errorListener = (err: Error) => {
                this.lineReader.off("line", listener);
                rej(err);
            };

            this.lineReader.on("line", listener);
            this.process.once("error", errorListener);

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

        return new Promise((res, rej) => {
            const listener = (log: string) => {
                parseInfoLine(log);

                // Depth 0 is given for terminal states (mate/stalemate);
                // its info line must still be parsed above, as it carries
                // the position's only evaluation
                if (
                    log.startsWith("bestmove")
                    || log.includes("depth 0")
                ) {
                    this.lineReader.off("line", listener);
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

            this.process.once("error", rej);

            this.send(`go depth ${options.depth}${timeLimitArgument}`);
        });
    }
}

/**
 * @description Fixed-size pool of Stockfish processes shared by every
 * evaluation request. Waiters are served first come first served, so
 * several users evaluating at once each get an engine as soon as one
 * frees up, instead of every request spawning its own processes and
 * oversubscribing the CPU.
 */
class ServerEnginePool {
    private idle: ServerEngine[] = [];
    private spawned = 0;
    private waiters: ((engine: ServerEngine) => void)[] = [];

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
        const idleEngine = this.idle.pop();
        if (idleEngine) return idleEngine;

        if (this.spawned < enginePoolSize) {
            this.spawned++;
            return new ServerEngine();
        }

        return null;
    }

    release(engine: ServerEngine) {
        const waiter = this.waiters.shift();
        if (waiter) return waiter(engine);

        this.idle.push(engine);
    }

    /** Remove a failed engine from the pool instead of releasing it */
    discard(engine: ServerEngine) {
        engine.terminate();
        this.spawned--;

        // Hand a replacement to the next waiter, who would otherwise
        // wait for a release that may never come
        const waiter = this.waiters.shift();

        if (waiter) {
            const replacement = this.tryAcquire();

            if (replacement) return waiter(replacement);

            this.waiters.unshift(waiter);
        }
    }
}

export const serverEnginePool = new ServerEnginePool();
