import z from "zod";

import { engineLineSchema } from "./EngineLine";
import { moveSchema } from "./Move";
import { Classification } from "@/constants/Classification";
import PieceColour from "@/constants/PieceColour";

export const boardStateSchema = z.object({
    fen: z.string(),
    move: moveSchema.optional(),
    moveColour: z.nativeEnum(PieceColour).optional(),
    engineLines: z.array(engineLineSchema),
    classification: z.nativeEnum(Classification).optional(),
    accuracy: z.number().optional(),
    opening: z.string().optional()
});

export type BoardState = z.infer<typeof boardStateSchema>;