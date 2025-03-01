import { max, maxBy, uniqWith } from "lodash";

import Classification from "../../constants/Classification";
import PieceColour from "../../constants/PieceColour";
import EngineLine from "./EngineLine";
import Move from "./Move";

interface BoardStateProps {
    fen: string;
    move?: Move;
    moveColour?: PieceColour;
    engineLines: {
        local?: EngineLine[];
        cloud?: EngineLine[];
    };
    classification?: Classification;
}

class BoardState {
    fen: string;
    move?: Move;
    moveColour?: PieceColour;
    engineLines: {
        local?: EngineLine[];
        cloud?: EngineLine[];
    };
    classification?: Classification;

    constructor(props: BoardStateProps) {
        this.fen = props.fen;
        this.move = props.move;
        this.moveColour = props.moveColour;
        this.engineLines = props.engineLines;
        this.classification = props.classification;
    }

    private combinedEngineLines() {
        return [
            ...(this.engineLines.local || []),
            ...(this.engineLines.cloud || [])
        ];
    }

    topEngineLine() {
        return maxBy(
            this.combinedEngineLines(),
            line => line.depth - line.index
        );
    }

    topEngineLines(count: number) {
        const combinedLines = this.combinedEngineLines();

        const maxDepth = max(
            combinedLines.map(line => line.depth)
        );

        if (!maxDepth) return [];

        return uniqWith(
            combinedLines.filter(line => line.depth == maxDepth),
            (a, b) => a.index == b.index
        ).slice(0, count);
    }
}

export default BoardState;