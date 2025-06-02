import { Chess, BLACK } from "chess.js";
import { trim } from "lodash";

import {
    AnalysedGame,
    GameResult,
    StateTreeNode,
    getNodeChain,
    getNodeMoveNumber,
    getNodeSiblings
} from "wintrchess";
import { classificationNags } from "@apps/analysis/constants/classifications";
import parsePgn from "@lib/games/pgn";
import parseStateTree from "./parse";

const pgnWhiteResults = {
    [GameResult.WIN]: "1-0",
    [GameResult.DRAW]: "1/2-1/2",
    [GameResult.LOSE]: "0-1",
    [GameResult.UNKNOWN]: "*"
} as const;

function getLastNodeWhiteResult(root: StateTreeNode) {
    const board = new Chess(root.state.fen);

    for (const node of getNodeChain(root)) {
        if (!node.state.move) continue;
        board.move(node.state.move.uci);
    }

    if (board.isCheckmate()) {
        return board.turn() == BLACK ? "1-0" : "0-1";
    }

    if (
        board.isDraw()
        || board.isStalemate()
        || board.isThreefoldRepetition()
    ) return "1/2-1/2";

    return "*";
}

function renderHeaders(headers: Record<string, string>) {
    return Object.entries(headers).map(
        ([ key, value ]) => `[${key} "${value}"]`
    ).join("\n");
}

export function renderStateTree(game: AnalysedGame) {
    function renderNode(
        node: StateTreeNode,
        renderVariations = false,
        forceNumber = false
    ) {
        const renderedParts: string[] = [];

        const moveNumber = getNodeMoveNumber(node);
        const whiteMove = moveNumber % 1 == 0;

        if (whiteMove || forceNumber) {
            renderedParts.push(
                Math.floor(moveNumber)
                + (whiteMove ? "." : "...")
            );
        }

        renderedParts.push(node.state.move!.san);

        const nag = node.state.classification
            ? classificationNags[node.state.classification]
            : undefined;

        if (nag) renderedParts.push(nag);

        if (renderVariations) {
            for (const sibling of getNodeSiblings(node)) {
                const renderedSibling = getNodeChain(sibling)
                    .map((node, index) => renderNode(
                        node, index != 0, index == 0
                    ))
                    .join(" ");

                renderedParts.push(`(${renderedSibling})`);
            }
        }

        return renderedParts.join(" ");
    }

    const nodeChain = getNodeChain(game.stateTree);

    // Render moves text
    const moves = nodeChain
        .filter(node => node.state.move)
        .map(node => renderNode(node, true))
        .join(" ");

    // Retain PGN result if last FEN matches that of the state tree
    const parsedPGN = parsePgn(game.pgn);

    const pgnLastNode = getNodeChain(parseStateTree(parsedPGN)).at(-1);

    const result = nodeChain.at(-1)?.state.fen == pgnLastNode?.state.fen
        ? pgnWhiteResults[parsedPGN.players.white.result]
        : getLastNodeWhiteResult(game.stateTree);

    // Render PGN headers
    const board = new Chess();
    board.loadPgn(game.pgn);

    const headers = renderHeaders(board.getHeaders());

    return trim(`${headers}\n\n${moves} ${result}`);
}