import { Chess } from "chess.js";

import { StateTreeNode, parseSanMove } from "wintrchess";

const moveSounds = {
    move: require("@assets/audio/move.mp3"),
    check: require("@assets/audio/check.mp3"),
    capture: require("@assets/audio/capture.mp3"),
    castle: require("@assets/audio/castle.mp3"),
    promote: require("@assets/audio/promote.mp3"),
    gameEnd: require("@assets/audio/gameend.mp3")
};

function playBoardSound(node: StateTreeNode) {
    const move = node.state.move;
    if (!move) return;

    const board = new Chess(node.state.fen);

    if (board.isGameOver()) {
        new Audio(moveSounds.gameEnd).play();
    }

    const parsedMove = parseSanMove(move.san);

    if (parsedMove.check || parsedMove.checkmate) {
        new Audio(moveSounds.check).play();
    } else if (parsedMove.castling) {
        new Audio(moveSounds.castle).play();
    } else if (parsedMove.promotion) {
        new Audio(moveSounds.promote).play();
    } else if (parsedMove.capture) {
        new Audio(moveSounds.capture).play();
    } else {
        new Audio(moveSounds.move).play();
    }
}

export default playBoardSound;