import { maxBy } from "lodash";

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

    topEngineLine() {
        return maxBy(
            [
                ...(this.engineLines.local || []),
                ...(this.engineLines.cloud || [])
            ],
            line => line.depth - line.index
        );
    }
}

export default BoardState;