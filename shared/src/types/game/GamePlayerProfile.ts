import z from "zod";

import { playerProfileSchema } from "./PlayerProfile";
import GameResult from "@constants/game/GameResult";

export const gamePlayerProfileSchema = playerProfileSchema
    .extend({ result: z.nativeEnum(GameResult) });

export type GamePlayerProfile = z.infer<typeof gamePlayerProfileSchema>;

export default GamePlayerProfile;