import { Move } from "chess.js";
import { useTranslation } from "react-i18next";

import {
    StateTreeNode,
    addChildMove,
    findNodeRecursively
} from "shared/types/game/position/StateTreeNode";
import {
    BookMove,
    OpeningDeviation
} from "shared/lib/reporter/utils/theoryDeviation";
import PieceColour from "shared/constants/PieceColour";
import displayToast from "@/lib/toast";
import playBoardSound from "@/lib/boardSounds";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useOpeningLessonStore, {
    LessonStatus
} from "@analysis/stores/OpeningLessonStore";

const OPPONENT_REPLY_DELAY = 700;

function useOpeningLesson() {
    const { t } = useTranslation("analysis");

    const analysisGame = useAnalysisGameStore(
        state => state.analysisGame
    );

    const {
        setCurrentStateTreeNode,
        dispatchCurrentNodeUpdate,
        setBoardFlipped,
        setAutoplayEnabled
    } = useAnalysisBoardStore();

    const lessonStore = useOpeningLessonStore();

    function playOpponentReply(reply: BookMove) {
        setTimeout(() => {
            if (!useOpeningLessonStore.getState().lesson) return;

            setCurrentStateTreeNode(prev => {
                const replyNode = addChildMove(prev, reply.san);
                playBoardSound(replyNode);

                useOpeningLessonStore
                    .getState()
                    .advanceLesson(replyNode.state.fen);

                return replyNode;
            });

            dispatchCurrentNodeUpdate();
        }, OPPONENT_REPLY_DELAY);
    }

    /**
     * @description Move the board to the position before the deviation
     * and begin practising the book line there.
     */
    function startLesson(deviation: OpeningDeviation, line: BookMove[]) {
        const deviationParent = findNodeRecursively(
            analysisGame.stateTree,
            node => node.id == deviation.parentNodeId
        );

        // Trim the line to always end on one of the user's own moves
        if (line.length % 2 == 0) {
            line = line.slice(0, -1);
        }

        if (!deviationParent || line.length == 0) return;

        setAutoplayEnabled(false);
        setCurrentStateTreeNode(deviationParent);
        dispatchCurrentNodeUpdate();
        setBoardFlipped(deviation.colour == PieceColour.BLACK);

        lessonStore.startLesson(deviation, line);

        displayToast({
            message: t("openingLesson.startedToast", {
                move: line[0].san
            }),
            theme: "info"
        });
    }

    function stopLesson() {
        lessonStore.stopLesson();
    }

    /**
     * @description Called for every move the user makes on the board;
     * checks it against the practised book line. The move has already
     * been added to the tree, so wrong moves are rolled back.
     */
    function handleBoardMove(move: Move, nodeBefore: StateTreeNode) {
        const lesson = useOpeningLessonStore.getState().lesson;

        if (!lesson || lesson.status != LessonStatus.ACTIVE) return;
        if (nodeBefore.state.fen != lesson.expectedFen) return;

        const expected = lesson.line[lesson.progress];
        if (!expected) return;

        if (move.san != expected.san) {
            displayToast({
                message: t("openingLesson.wrongMoveToast", {
                    move: expected.san
                }),
                theme: "error",
                autoClose: 4
            });

            // Roll the board back to the practised position
            setTimeout(() => {
                if (!useOpeningLessonStore.getState().lesson) return;

                setCurrentStateTreeNode(nodeBefore);
                dispatchCurrentNodeUpdate();
            }, OPPONENT_REPLY_DELAY);

            return;
        }

        lessonStore.advanceLesson(move.after);

        const completed = lesson.progress + 1 >= lesson.line.length;

        if (completed) {
            return displayToast({
                message: t("openingLesson.completedToast", {
                    opening: lesson.deviation.openingName
                }),
                theme: "success"
            });
        }

        displayToast({
            message: t("openingLesson.correctMoveToast"),
            theme: "success",
            autoClose: 2
        });

        const reply = lesson.line.at(lesson.progress + 1);

        if (reply) {
            playOpponentReply(reply);
        }
    }

    return {
        lesson: lessonStore.lesson,
        startLesson,
        stopLesson,
        handleBoardMove
    };
}

export default useOpeningLesson;
