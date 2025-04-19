import { Chess, KING, PAWN, ROOK } from "chess.js";
import { minBy } from "lodash";

import BoardPiece from "../types/BoardPiece";
import PieceColour from "@constants/PieceColour";
import { pieceValues } from "@constants/utils";
import { adaptPieceColour } from "@lib/moveNotation";
import { getAttackers } from "./attackers";
import { getDefenders } from "./defenders";
import { getBoardPieces } from "./boardPieces";

export function getPieceSafety(
    board: Chess,
    piece: BoardPiece,
    capturedPiece?: BoardPiece
) {
    const attackers = getAttackers(board, piece);
    const defenders = getDefenders(board, piece);

    // Favourable, decimal sacrifices (rook for 2 pieces etc.) are safe
    if (
        capturedPiece
        && piece.type == ROOK
        && pieceValues[capturedPiece.type] == 3
        && attackers.length == 1
        && pieceValues[attackers[0].type] == 3
    ) {
        return true;
    }

    // A piece with an attacker of lower value than itself cannot be safe
    const hasLowerValueAttacker = attackers.some(
        attacker => pieceValues[attacker.type] < pieceValues[piece.type]
    );

    if (hasLowerValueAttacker) return false;

    // A piece that does not have more attackers than it has defenders is safe
    if (attackers.length <= defenders.length) {
        return true;
    }

    // A piece lower in value than any attacker, and with any defender lower
    // in value than all attackers, must be safe
    const lowestValueAttacker = minBy(attackers,
        attacker => pieceValues[attacker.type]
    );

    if (!lowestValueAttacker) return true;

    if (
        pieceValues[piece.type] < pieceValues[lowestValueAttacker.type]
        && defenders.some(defender => (
            pieceValues[defender.type] < pieceValues[lowestValueAttacker.type]
        ))
    ) return true;

    // A piece defended by any pawn, at this point, must be safe
    if (defenders.some(defender => defender.type == PAWN)) {
        return true;
    }

    return false;
}

export function getUnsafePieces(
    board: Chess,
    colour: PieceColour,
    capturedPiece?: BoardPiece
) {
    const capturedPieceValue = capturedPiece
        ? pieceValues[capturedPiece.type] : 0;

    return getBoardPieces(board)
        .filter(piece => (
            piece?.color == adaptPieceColour(colour)
            && piece.type != KING
            && piece.type != PAWN
            && pieceValues[piece.type] > capturedPieceValue
            && !getPieceSafety(board, piece, capturedPiece)
        ));
}