import Classification from "../../constants/Classification";
import Evaluation from "./Evaluation";

interface Position {
    classification: Classification;
    engineLines?: {
        local: Evaluation[];
        cloud: Evaluation[];
    };
}

export default Position;