import { Chess } from "chess.js";
import { maxBy, uniq, uniqWith } from "lodash";

import { serializeObject } from "../../../lib/serialization";
import { deserializeEngineLine, EngineLine, SerializedEngineLine } from "./EngineLine";
import EngineVersion from "../../../constants/game/EngineVersion";
import Classification from "../../../constants/Classification";
import PieceColour from "../../../constants/PieceColour";
import Move from "./Move";

interface BoardStateProps {
    fen: string;
    move?: Move;
    moveColour?: PieceColour;
    engineLines?: EngineLine[];
    classification?: Classification;
}

export type SerializedBoardState = (
    Omit<BoardStateProps, "engineLines">
    & { engineLines: SerializedEngineLine[] }
);

export class BoardState {
    fen: string;
    move?: Move;
    moveColour?: PieceColour;
    engineLines: EngineLine[];
    classification?: Classification;

    constructor(props: BoardStateProps) {
        this.fen = props.fen;
        this.move = props.move;
        this.moveColour = props.moveColour;
        this.engineLines = props.engineLines || [];
        this.classification = props.classification;
    }

    serialize(): SerializedBoardState {
        return serializeObject({
            ...this,
            engineLines: this.engineLines.map(
                line => line.serialize()
            )
        });
    }

    /**
     * @description Returns the line with the highest depth and lowest index.
     */
    topEngineLine() {
        return maxBy(
            this.engineLines,
            line => line.depth - line.index
        );
    }

    /**
     * @description Returns a set of sorted lines that match the targets given,
     * or null if one of the given targets cannot be met. Lichess Cloud
     * lines will always override target source where other targets are met.
     */
    displayedLines(options?: {
        targetSource?: EngineVersion;
        targetCount?: number;
        targetDepth?: number;
    }) {
        // Cap target count to number of legal moves
        const legalMoveCount = new Chess(this.fen).moves().length;

        if (options?.targetCount) {
            options.targetCount = Math.min(
                Math.max(legalMoveCount, 1),
                options.targetCount
            );
        }

        // If no legal moves, target depth should be removed
        if (options?.targetDepth && legalMoveCount == 0) {
            options.targetDepth = 0;
        }

        const {
            targetSource,
            targetCount,
            targetDepth
        } = options || {};

        const depths = uniq(
            this.engineLines
                .map(line => line.depth)
                .filter(depth => !targetDepth || depth >= targetDepth)
                .sort((a, b) => b - a)
        );

        for (const depth of depths) {
            const depthLines = uniqWith(
                this.engineLines.filter(
                    line => line.depth == depth
                ),
                (lineA, lineB) => lineA.isEqual(lineB)
            );

            let displayedLines: EngineLine[] | undefined;

            // If cloud lines are sufficient, consider them first
            const cloudLines = depthLines.filter(
                line => line.source == EngineVersion.LICHESS_CLOUD
            ).slice(0, targetCount);

            if (cloudLines.length >= (targetCount ?? 1)) {
                displayedLines ??= cloudLines;
            }

            // Otherwise consider local lines if sufficient
            const localLines = depthLines.filter(
                line => !targetSource || line.source == targetSource
            ).slice(0, targetCount);

            if (localLines.length >= (targetCount ?? 1)) {
                displayedLines ??= localLines;
            }

            // If either are sufficient, sort by index and return
            if (displayedLines) {
                return displayedLines.sort(
                    (a, b) => a.index - b.index
                );
            }
        }

        return null;
    }
}

export function deserializeBoardState(state: SerializedBoardState) {
    return new BoardState({
        ...state,
        engineLines: state.engineLines.map(deserializeEngineLine)
    });
}