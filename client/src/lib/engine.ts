import { Chess } from "chess.js";

import { EngineLine, STARTING_FEN } from "wintrchess";
import EngineVersion from "@constants/EngineVersion";

interface EvaluationResult {
    elapsedTime: number;
    lines: EngineLine[];
}

// Convert UCI evaluation types to our ones
const UCI_EVALUATION_TYPES: Record<string, string | undefined> = {
    cp: "centipawn",
    mate: "mate"
};

class Engine {
    private worker: Worker;

    private position = STARTING_FEN;

    constructor(version: EngineVersion) {
        this.worker = new Worker("engines/" + version);

        this.worker.postMessage("uci");
        this.setPosition(this.position);
    }

    private consumeLogs(
        command: string,
        endCondition: (logMessage: string) => boolean,
        onLogReceived?: (logMessage: string) => void
    ): Promise<string[]> {
        this.worker.postMessage(command);

        const worker = this.worker;
        const logMessages: string[] = [];

        return new Promise((resolve, reject) => {
            function onMessageReceived(event: MessageEvent) {
                const message = String(event.data);

                onLogReceived?.(message);
    
                logMessages.push(message);
    
                if (endCondition(message)) {
                    worker.removeEventListener("message", onMessageReceived);
                    worker.removeEventListener("error", reject);

                    resolve(logMessages);
                }
            }

            this.worker.addEventListener("message", onMessageReceived);
            this.worker.addEventListener("error", reject);
        });
    }

    onMessage(handler: (message: string) => void) {
        this.worker.addEventListener("message", event => {
            handler(String(event.data));
        });

        return this;
    }

    onError(handler: (error: string) => void) {
        this.worker.addEventListener("error", event => {
            handler(String(event.error));
        });

        return this;
    }

    terminate() {
        this.worker.postMessage("quit");
    }

    setOption(option: string, value: string) {
        this.worker.postMessage(
            `setoption name ${option} value ${value}`
        );

        return this;
    }

    setLineCount(lines: number) {
        this.setOption("MultiPV", lines.toString());

        return this;
    }

    setThreadCount(threads: number) {
        this.setOption("Threads", threads.toString());

        return this;
    }

    setPosition(fen: string, uciMoves?: string[]) {
        if (uciMoves?.length) {
            this.worker.postMessage(
                `position fen ${fen} moves ${uciMoves.join(" ")}`
            );

            const board = new Chess(fen);
            for (const uciMove of uciMoves) {
                board.move(uciMove);
            }

            this.position = board.fen();

            return;
        }

        this.worker.postMessage(`position fen ${fen}`);
        this.position = fen;

        return this;
    }

    async evaluate(
        depth: number,
        onDepthReached?: (depth: number, lines: EngineLine[]) => void
    ): Promise<EvaluationResult> {
        const startTime = Date.now();

        let engineLines: EngineLine[] = [];

        await this.consumeLogs(
            `go depth ${depth}`,
            log => (
                log.startsWith("bestmove")
                || log.includes("depth 0")
            ),
            log => {
                if (!log.startsWith("info depth")) return;
                if (log.includes("currmove")) return;

                // Extract depth and multipv index of line
                const depth = parseInt(log.match(/(?<= depth )\d+/)?.[0] || "");
                if (isNaN(depth)) return;

                const index = parseInt(log.match(/(?<= multipv )\d+/)?.[0] || "") || 1;

                // Extract evaluation type and score
                const scoreMatches = log.match(/ score (cp|mate) (-?\d+)/);

                const evaluationType = UCI_EVALUATION_TYPES[scoreMatches?.[1] || ""];
                if (
                    evaluationType != "centipawn"
                    && evaluationType != "mate"
                ) return;

                let evaluationScore = parseInt(scoreMatches?.[2] || "");
                if (isNaN(evaluationScore)) return;

                // Make sure evaluations are always from White's view
                if (this.position.includes(" b ")) {
                    evaluationScore = -evaluationScore;
                }

                // Extract UCI moves from pv
                const moveUcis = log.match(/ pv (.*)/)?.at(1)?.split(" ") || [];

                // Convert these to SANs on a temp board
                const moveSans: string[] = [];

                const board = new Chess(this.position);
                for (const moveUci of moveUcis) {
                    moveSans.push(board.move(moveUci).san);
                }

                // Remove old duplicate line and add new one
                engineLines = engineLines.filter(line => (
                    line.depth != depth || line.index != index
                ));

                engineLines.push({
                    depth: depth,
                    index: index,
                    evaluation: {
                        type: evaluationType,
                        value: evaluationScore
                    },
                    moves: moveUcis.map((moveUci, moveIndex) => ({
                        uci: moveUci,
                        san: moveSans[moveIndex]
                    }))
                });

                onDepthReached?.(depth, engineLines);
            }
        );

        return {
            elapsedTime: Date.now() - startTime,
            lines: engineLines 
        };
    }

    stopEvaluation() {
        this.worker.postMessage("stop");
    }
}

export default Engine;