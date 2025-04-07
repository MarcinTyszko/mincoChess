import { uniqueId } from "lodash";

import startingLines from "../../resources/startingLines.json";
import { StateTreeNode } from "../types/game/position/StateTreeNode";
import { EngineLine } from "../types/game/position/EngineLine";

export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const defaultRootNode: StateTreeNode = {
    id: uniqueId(),
    mainline: true,
    children: [],
    state: {
        fen: STARTING_FEN,
        engineLines: startingLines as EngineLine[]
    }
};