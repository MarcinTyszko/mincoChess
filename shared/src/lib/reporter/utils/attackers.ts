import { Chess, Square, KING } from "chess.js";
import { isEqual, xorWith } from "lodash";

import BoardPiece from "../types/BoardPiece";
import { flipAdaptedPieceColour, setFenTurn } from "@lib/moveNotation";

interface TransitiveAttacker {
    fen: string;
    square: Square;
}

function directAttackers(board: Chess, piece: BoardPiece): BoardPiece[] {
    // Set turn to attacker's side (opposite of piece)
    board = new Chess(
        setFenTurn(board.fen(), flipAdaptedPieceColour(piece.color))
    );

    const legalMoves = board.moves({ verbose: true });

    return board
        .attackers(piece.square, flipAdaptedPieceColour(piece.color))
        .filter(attackerSquare => (
            legalMoves.some(move => (
                move.from == attackerSquare
                && move.to == piece.square
            ))
            || board.get(attackerSquare)?.type == KING
        ))
        .map(attackerSquare => ({
            square: attackerSquare,
            ...board.get(attackerSquare)!
        }));
}

export function getAttackers(
    board: Chess,
    piece: BoardPiece,
    transitive: boolean = true
) {
    const attackers = directAttackers(board, piece);
    
    if (!transitive) return attackers;

    // Keep a record of each transitive attacker and the FEN on
    // which they are considered a direct attacker
    const frontier: TransitiveAttacker[] = attackers.map(
        attacker => ({
            fen: board.fen(),
            square: attacker.square
        })
    );

    while (frontier.length > 0) {
        const transitiveAttacker = frontier.pop();
        if (!transitiveAttacker) break;

        // A king cannot be at the front of a battery
        const transitiveBoard = new Chess(transitiveAttacker.fen);

        if (transitiveBoard.get(transitiveAttacker.square)?.type == KING) {
            continue;
        }

        // Remove the piece at the front of the battery
        const oldDirectAttackers = directAttackers(transitiveBoard, piece);

        transitiveBoard.remove(transitiveAttacker.square);

        // Find revealed attackers as a XOR between old (removed piece excluded)
        // and new direct attackers list
        const revealedDirectAttackers = xorWith(
            oldDirectAttackers.filter(
                attacker => attacker.square != transitiveAttacker.square
            ),
            directAttackers(transitiveBoard, piece),
            isEqual
        );

        // Record revealed attackers in final list
        attackers.push(...revealedDirectAttackers);

        // Queue revealed attackers for further recursion
        frontier.push(
            ...revealedDirectAttackers.map(attacker => ({
                fen: transitiveBoard.fen(),
                square: attacker.square
            }))
        );
    }

    return attackers;
}