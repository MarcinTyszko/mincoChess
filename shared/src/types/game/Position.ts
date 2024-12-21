import Classification from "../../constants/Classification";
import EngineLine from "./EngineLine";

interface Position {
    classification: Classification;
    engineLines?: {
        local: EngineLine[];
        cloud: EngineLine[];
    };
}

export default Position;