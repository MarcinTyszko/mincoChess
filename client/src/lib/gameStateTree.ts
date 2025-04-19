import { uniqueId } from "lodash";
import { parseGame } from "@mliebelt/pgn-parser";
import { Chess } from "chess.js";

import {
    Game,
    PieceColour,
    StateTreeNode
} from "wintrchess";

function parseStateTree(game: Game) {
    const parsedPGN = parseGame(game.pgn);

    type ParsedPGNMove = typeof parsedPGN.moves[number];

    function addMovesToNode(
        node: StateTreeNode,
        moves: ParsedPGNMove[],
        mainline: boolean
    ) {
        let lastNode = node;

        for (const pgnMove of moves) {
            const move = new Chess(lastNode.state.fen)
                .move(pgnMove.notation.notation);

            const newNode: StateTreeNode = {
                id: uniqueId(),
                mainline: mainline,
                parent: lastNode,
                children: [],
                state: {
                    fen: move.after,
                    engineLines: [],
                    move: {
                        san: move.san,
                        uci: move.lan
                    },
                    moveColour: move.color == "w"
                        ? PieceColour.WHITE
                        : PieceColour.BLACK
                }
            };

            lastNode.children.push(newNode);

            for (const variation of pgnMove.variations) {
                addMovesToNode(lastNode, variation, false);
            }

            lastNode = newNode;
        }
    }

    const rootNode: StateTreeNode = {
        id: uniqueId(),
        mainline: true,
        children: [],
        state: {
            fen: game.initialPosition,
            engineLines: []
        }
    };

    addMovesToNode(rootNode, parsedPGN.moves, true);

    return rootNode;
}

export default parseStateTree;