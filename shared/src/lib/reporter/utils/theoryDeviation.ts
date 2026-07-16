import { Chess } from "chess.js";

import {
    StateTreeNode,
    getNodeChain
} from "@/types/game/position/StateTreeNode";
import { Classification } from "@/constants/Classification";
import PieceColour from "@/constants/PieceColour";
import { getOpeningName } from "./opening";

export interface BookMove {
    san: string;
    openingName: string;
}

export interface OpeningDeviation {
    nodeId: string;
    parentNodeId: string;
    parentFen: string;
    openingName: string;
    playedMoveSan: string;
    colour: PieceColour;
    classification?: Classification;
    isError: boolean;
    bookMoves: BookMove[];
}

const errorClassifications: Classification[] = [
    Classification.INACCURACY,
    Classification.MISTAKE,
    Classification.BLUNDER
];

/**
 * @description All legal moves from the given position that lead to a
 * named position in the openings database.
 */
export function getBookMoves(fen: string): BookMove[] {
    let board: Chess;

    try {
        board = new Chess(fen);
    } catch {
        return [];
    }

    const bookMoves: BookMove[] = [];

    for (const move of board.moves({ verbose: true })) {
        const openingName = getOpeningName(move.after);

        if (openingName) {
            bookMoves.push({
                san: move.san,
                openingName: openingName
            });
        }
    }

    return bookMoves;
}

/**
 * @description How many further plies of known theory follow from the
 * given position, looking at most `plies` moves ahead. Used to prefer
 * main lines over rarely played sideline gambits, which tend to be dead
 * ends in the openings database.
 */
function getBookDepth(
    fen: string,
    plies: number,
    cache: Map<string, number>
): number {
    if (plies <= 0) return 0;

    const cacheKey = `${fen} ${plies}`;
    const cached = cache.get(cacheKey);

    if (cached != undefined) return cached;

    let depth = 0;

    for (const candidate of getBookMoves(fen).slice(0, 6)) {
        const afterFen = new Chess(fen).move(candidate.san).after;

        depth = Math.max(
            depth,
            1 + getBookDepth(afterFen, plies - 1, cache)
        );
    }

    cache.set(cacheKey, depth);

    return depth;
}

/**
 * @description Greedily follow book moves from the given position to build
 * a practisable theory line. Continuations with the deepest known follow-up
 * theory are preferred; ties are broken towards moves that extend the
 * current opening's name, to stay within the same variation.
 */
export function getBookLine(fen: string, maxPlies = 6): BookMove[] {
    const line: BookMove[] = [];
    const depthCache = new Map<string, number>();

    let currentFen = fen;
    let currentName = getOpeningName(fen) || "";

    for (let ply = 0; ply < maxPlies; ply++) {
        const candidates = getBookMoves(currentFen).map(move => {
            const afterFen = new Chess(currentFen).move(move.san).after;

            return {
                move: move,
                afterFen: afterFen,
                score: 10 * getBookDepth(afterFen, 3, depthCache)
                    + (move.openingName.startsWith(currentName) ? 5 : 0)
            };
        });

        const best = candidates.sort((a, b) => (
            b.score - a.score
            || a.move.san.localeCompare(b.move.san)
        )).at(0);

        if (!best) break;

        line.push(best.move);

        currentFen = best.afterFen;
        currentName = best.move.openingName;
    }

    return line;
}

function isNodeInBook(node: StateTreeNode) {
    if (node.state.opening || getOpeningName(node.state.fen)) return true;

    // The root of a standard game has no opening name of its own
    return !node.parent && node.state.fen.startsWith(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    );
}

/**
 * @description Find the moment in the mainline where the game left known
 * opening theory for good. The openings database is position-keyed and has
 * gaps in long theory lines, so the deviation is anchored to the move
 * played right after the LAST position that is still in the database.
 * Returns an empty list when the game never left theory, or when no book
 * alternative is known from the deviation point.
 */
export function findOpeningDeviations(
    rootNode: StateTreeNode
): OpeningDeviation[] {
    const chain = getNodeChain(rootNode);

    let lastBookIndex = -1;

    chain.forEach((node, index) => {
        if (isNodeInBook(node)) lastBookIndex = index;
    });

    // The game either never touched theory, or never left it
    if (lastBookIndex < 0 || lastBookIndex + 1 >= chain.length) return [];

    const node = chain[lastBookIndex + 1];

    if (!node.parent || !node.state.move || !node.state.moveColour) {
        return [];
    }

    const bookMoves = getBookMoves(node.parent.state.fen);
    if (bookMoves.length == 0) return [];

    return [{
        nodeId: node.id,
        parentNodeId: node.parent.id,
        parentFen: node.parent.state.fen,
        openingName: node.parent.state.opening
            || getOpeningName(node.parent.state.fen)
            || bookMoves[0].openingName,
        playedMoveSan: node.state.move.san,
        colour: node.state.moveColour,
        classification: node.state.classification,
        isError: node.state.classification != undefined
            && errorClassifications.includes(node.state.classification),
        bookMoves: bookMoves
    }];
}
