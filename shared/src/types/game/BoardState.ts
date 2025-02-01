import Classification from "../../constants/Classification";
import EngineLine from "./EngineLine";
import Move from "./Move";

interface BoardState {
    fen: string;
    move?: Move;
    engineLines: {
        local?: EngineLine[];
        cloud?: EngineLine[];
    };
    classification?: Classification;
}

export default BoardState;