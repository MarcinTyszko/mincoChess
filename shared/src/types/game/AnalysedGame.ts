import z from "zod";

import { gameSchema } from "./Game";
import { gameAnalysisSchema } from "./GameAnalysis";
import { SerializedStateTreeNode } from "./position/StateTreeNode";

export const analysedGameSchema = gameSchema.merge(gameAnalysisSchema);

export type AnalysedGame = z.infer<typeof analysedGameSchema>;

export type SerializedAnalysedGame = (
    Omit<AnalysedGame, "stateTree">
    & { stateTree: SerializedStateTreeNode }
);

export default AnalysedGame;