import { Chess } from "chess.js";

import { EngineLine } from "wintrchess";
import EngineVersion from "@constants/EngineVersion";

interface EvaluationResult {
    elapsedTime: number;
    lines: EngineLine[];
}

// Convert UCI evaluation types to our ones
const uciEvaluationTypes: Record<string, string> = {
    cp: "centipawn",
    mate: "mate"
};

class Engine {
    private worker: Worker;

    private position = new Chess().fen();

    constructor(version: EngineVersion) {
        this.worker = new Worker("engines/" + version);

        this.worker.postMessage("uci");
        this.setPosition(this.position);
    }

    private consumeLogs(
        command: string,
        endCondition: (logMessage: string) => boolean
    ): Promise<string[]> {
        this.worker.postMessage(command);

        const worker = this.worker;
        const logMessages: string[] = [];

        return new Promise((resolve, reject) => {
            function onMessageReceived(event: MessageEvent) {
                const message = String(event.data);
    
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

    setOption(option: string, value: string) {
        this.worker.postMessage(
            `setoption name ${option} value ${value}`
        );
    }

    setLineCount(lines: number) {
        this.setOption("MultiPV", lines.toString());
    }

    setPosition(fen: string) {
        this.worker.postMessage(`position ${fen}`);
        this.position = fen;
    }

    async evaluate(depth: number): Promise<EvaluationResult> {
        const startTime = Date.now();

        const evaluationLogs = (await this.consumeLogs(
            `go depth ${depth}`,
            message => (
                message.startsWith("bestmove")
                || message.includes("depth 0")
            )
        )).filter(
            message => message.startsWith("info depth")
        );

        const engineLines: EngineLine[] = [];

        for (const log of evaluationLogs.reverse()) {
            // Extract depth and multipv index of line
            const depth = parseInt(log.match(/(?<= depth )\d+/)?.[0] || "");
            const index = parseInt(log.match(/(?<= multipv )\d+/)?.[0] || "");
            if (isNaN(depth) || isNaN(index)) continue;

            // Skip non-latest line with this depth & index
            const duplicateLine = engineLines.some(
                line => line.depth == depth && line.index == index
            );
            if (duplicateLine) continue;

            // Extract evaluation type and score
            const scoreMatches = log.match(/ score (cp|mate) (\d+)/);

            const evaluationType = uciEvaluationTypes[scoreMatches?.[1] || ""];
            if (
                evaluationType != "centipawn"
                && evaluationType != "mate"
            ) continue;

            const evaluationScore = parseInt(scoreMatches?.[2] || "");
            if (isNaN(evaluationScore)) continue;

            // Extract UCI moves from pv
            const moveUcis = (log.match(/ pv (.*)/)?.[1] || "").split(" ");
            if (moveUcis.length == 0) continue;

            // Convert these to SANs on a temp board
            const moveSans: string[] = [];

            const board = new Chess(this.position);
            for (const moveUci of moveUcis) {
                moveSans.push(board.move(moveUci).san);
            }

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
        }

        return {
            elapsedTime: Date.now() - startTime,
            lines: engineLines 
        };
    }
}

export default Engine;