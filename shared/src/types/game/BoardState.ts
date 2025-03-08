import { maxBy, uniq, uniqWith } from "lodash";

import Classification from "../../constants/Classification";
import PieceColour from "../../constants/PieceColour";
import EngineLine from "./EngineLine";
import Move from "./Move";

interface BoardStateProps {
    fen: string;
    move?: Move;
    moveColour?: PieceColour;
    engineLines?: EngineLine[];
    classification?: Classification;
}

class BoardState {
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
     * @description Returns the lines of a state with the highest depth. May return
     * as many lines as specified with their different indexes, or an empty list if
     * enough lines cannot be found at a single depth.
     */
    topEngineLines(count: number) {
        const depths = uniq(
            this.engineLines
                .map(line => line.depth)
                .sort((a, b) => b - a)
        );

        for (const depth of depths) {
            const lines = uniqWith(
                this.engineLines.filter(line => line.depth == depth),
                (a, b) => a.index == b.index
            );

            if (lines.length >= count) {
                return lines.slice(0, count);
            }
        }

        return [];
    }
}

export default BoardState;