import { Chess, Move, Square } from "chess.js";
import { create } from "zustand";

import {
    OpeningVariation,
    getVariationId
} from "shared/lib/learning/catalog";
import PieceColour, { adaptPieceColour } from "shared/constants/PieceColour";
import useLearningProgressStore from "@/stores/LearningProgressStore";

export enum LessonMode {
    LEARN = "learn",
    CHALLENGE = "challenge"
}

export enum LessonStatus {
    ACTIVE = "active",
    COMPLETED = "completed"
}

export enum MoveVerdict {
    CORRECT = "correct",
    WRONG = "wrong",
    IGNORED = "ignored"
}

export interface Lesson {
    familyName: string;
    variation: OpeningVariation;
    mode: LessonMode;
    line: string[];
    playerColour: PieceColour;
    /** Index of the next expected ply in the line */
    plyIndex: number;
    /** Ply the lesson started from (challenges start mid-line) */
    startPly: number;
    fen: string;
    wrongAttempts: number;
    /** 0 = none, 1 = piece highlighted, 2 = full solution shown */
    hintLevel: 0 | 1 | 2;
    status: LessonStatus;
    lastVerdict?: MoveVerdict;
}

interface LessonStore {
    lesson?: Lesson;

    startLesson: (
        familyName: string,
        variation: OpeningVariation,
        mode: LessonMode,
        playerColour: PieceColour
    ) => void;
    tryMove: (from: Square, to: Square) => MoveVerdict;
    requestHint: () => void;
    stopLesson: () => void;
}

const OPPONENT_REPLY_DELAY = 600;

function getFenAtPly(line: string[], ply: number) {
    const board = new Chess();

    for (const san of line.slice(0, ply)) {
        board.move(san);
    }

    return board.fen();
}

function isPlayerTurn(fen: string, playerColour: PieceColour) {
    return adaptPieceColour(new Chess(fen).turn()) == playerColour;
}

/**
 * @description The move object for the next expected ply of the
 * active lesson, or undefined when the line has ended.
 */
export function getExpectedMove(lesson: Lesson): Move | undefined {
    const san = lesson.line.at(lesson.plyIndex);
    if (!san) return undefined;

    try {
        return new Chess(lesson.fen).move(san);
    } catch {
        return undefined;
    }
}

/**
 * @description Pick a random ply for a challenge to start from; always
 * one of the learner's own turns, and never the very last ply so there
 * is at least one move left to find.
 */
function pickChallengeStart(line: string[], playerColour: PieceColour) {
    const playerParity = playerColour == PieceColour.WHITE ? 0 : 1;

    const candidates = [];

    for (let ply = playerParity; ply < line.length; ply += 2) {
        candidates.push(ply);
    }

    if (candidates.length == 0) return 0;

    return candidates[Math.floor(Math.random() * candidates.length)];
}

function advanceLesson(lesson: Lesson, playedMove: Move): Lesson {
    const plyIndex = lesson.plyIndex + 1;
    const completed = plyIndex >= lesson.line.length;

    return {
        ...lesson,
        plyIndex: plyIndex,
        fen: playedMove.after,
        wrongAttempts: 0,
        hintLevel: 0,
        status: completed ? LessonStatus.COMPLETED : LessonStatus.ACTIVE,
        lastVerdict: MoveVerdict.CORRECT
    };
}

const useLessonStore = create<LessonStore>((set, get) => {
    function completeLesson(lesson: Lesson) {
        useLearningProgressStore
            .getState()
            .markVariationComplete(getVariationId(lesson.variation));
    }

    /**
     * @description Play the opponent's next book move after a short
     * delay, for as long as it is not the learner's turn.
     */
    function scheduleOpponentReply() {
        setTimeout(() => {
            const lesson = get().lesson;

            if (
                !lesson
                || lesson.status != LessonStatus.ACTIVE
                || isPlayerTurn(lesson.fen, lesson.playerColour)
            ) return;

            const reply = getExpectedMove(lesson);
            if (!reply) return;

            const advanced = advanceLesson(lesson, reply);

            set({
                lesson: {
                    ...advanced,
                    lastVerdict: lesson.lastVerdict
                }
            });

            if (advanced.status == LessonStatus.COMPLETED) {
                completeLesson(advanced);
            } else {
                scheduleOpponentReply();
            }
        }, OPPONENT_REPLY_DELAY);
    }

    return {
        startLesson(familyName, variation, mode, playerColour) {
            const startPly = mode == LessonMode.CHALLENGE
                ? pickChallengeStart(variation.moves, playerColour)
                : 0;

            set({
                lesson: {
                    familyName: familyName,
                    variation: variation,
                    mode: mode,
                    line: variation.moves,
                    playerColour: playerColour,
                    plyIndex: startPly,
                    startPly: startPly,
                    fen: getFenAtPly(variation.moves, startPly),
                    wrongAttempts: 0,
                    hintLevel: 0,
                    status: LessonStatus.ACTIVE
                }
            });

            scheduleOpponentReply();
        },

        tryMove(from, to) {
            const lesson = get().lesson;

            if (
                !lesson
                || lesson.status != LessonStatus.ACTIVE
                || !isPlayerTurn(lesson.fen, lesson.playerColour)
            ) return MoveVerdict.IGNORED;

            const expected = getExpectedMove(lesson);
            if (!expected) return MoveVerdict.IGNORED;

            if (from != expected.from || to != expected.to) {
                // Reject moves that are not even legal without penalty
                try {
                    new Chess(lesson.fen).move({
                        from, to,
                        promotion: "q"
                    });
                } catch {
                    return MoveVerdict.IGNORED;
                }

                const wrongAttempts = lesson.wrongAttempts + 1;

                set({
                    lesson: {
                        ...lesson,
                        wrongAttempts: wrongAttempts,
                        hintLevel: wrongAttempts >= 2 ? 2 : 1,
                        lastVerdict: MoveVerdict.WRONG
                    }
                });

                return MoveVerdict.WRONG;
            }

            const advanced = advanceLesson(lesson, expected);

            set({ lesson: advanced });

            if (advanced.status == LessonStatus.COMPLETED) {
                completeLesson(advanced);
            } else {
                scheduleOpponentReply();
            }

            return MoveVerdict.CORRECT;
        },

        requestHint() {
            const lesson = get().lesson;
            if (!lesson || lesson.status != LessonStatus.ACTIVE) return;

            set({
                lesson: {
                    ...lesson,
                    hintLevel: lesson.hintLevel >= 1 ? 2 : 1
                }
            });
        },

        stopLesson() {
            set({ lesson: undefined });
        }
    };
});

export default useLessonStore;
