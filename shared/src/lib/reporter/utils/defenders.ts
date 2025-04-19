import { Chess, QUEEN } from "chess.js";
import { minBy } from "lodash";

import BoardPiece from "../types/BoardPiece";
import { flipAdaptedPieceColour } from "@lib/moveNotation";
import { getAttackers } from "./attackers";

export function getDefenders(
    board: Chess,
    piece: BoardPiece,
    transitive: boolean = true
) {
    const defenderBoard = new Chess(board.fen());

    const attackers = getAttackers(defenderBoard, piece, false);

    // Where there are attackers, simulate taking the piece with each attacker
    // and record the minima of recaptures
    const smallestRecapturerSet = minBy(
        attackers.map(attacker => {
            const captureBoard = new Chess(defenderBoard.fen());

            try {
                captureBoard.move({
                    from: attacker.square,
                    to: piece.square,
                    promotion: QUEEN
                });
            } catch {
                return null;
            }

            return getAttackers(
                captureBoard,
                { ...attacker, square: piece.square },
                transitive
            );
        }).filter(
            recapturers => !!recapturers
        ),
        recapturers => recapturers.length
    );

    // Where there are no attackers, flip the colour of the piece and count
    // the attackers of the flipped piece
    if (!smallestRecapturerSet) {
        const flippedPiece: BoardPiece = {
            type: piece.type,
            color: flipAdaptedPieceColour(piece.color),
            square: piece.square
        };

        defenderBoard.put(flippedPiece, piece.square);
        
        return getAttackers(defenderBoard, flippedPiece, transitive);
    }

    return smallestRecapturerSet;
}