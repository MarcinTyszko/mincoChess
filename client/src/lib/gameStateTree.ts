import { parseGame } from "@mliebelt/pgn-parser";
import { Chess } from "chess.js";

import {
    BoardState,
    Game,
    PieceColour,
    StateTreeNode
} from "wintrchess";

function getStateTree(game: Game) {
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

            const newNode = new StateTreeNode({
                mainline: mainline,
                parent: lastNode,
                children: [],
                state: new BoardState({
                    fen: move.after,
                    move: {
                        san: move.san,
                        uci: move.lan
                    },
                    moveColour: move.color == "w"
                        ? PieceColour.WHITE
                        : PieceColour.BLACK
                })
            });

            lastNode.children.push(newNode);

            for (const variation of pgnMove.variations) {
                addMovesToNode(lastNode, variation, false);
            }

            lastNode = newNode;
        }
    }

    const rootNode = new StateTreeNode({
        mainline: true,
        children: [],
        state: new BoardState({
            fen: game.initialPosition
        })
    });

    addMovesToNode(rootNode, parsedPGN.moves, true);

    return rootNode;
}

export default getStateTree;