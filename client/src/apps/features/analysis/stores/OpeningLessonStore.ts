import { create } from "zustand";

import {
    BookMove,
    OpeningDeviation
} from "shared/lib/reporter/utils/theoryDeviation";

export enum LessonStatus {
    ACTIVE = "active",
    COMPLETED = "completed"
}

export interface OpeningLesson {
    deviation: OpeningDeviation;
    line: BookMove[];
    progress: number;
    expectedFen: string;
    status: LessonStatus;
}

interface OpeningLessonStore {
    lesson?: OpeningLesson;

    startLesson: (
        deviation: OpeningDeviation,
        line: BookMove[]
    ) => void;
    advanceLesson: (newExpectedFen: string) => void;
    stopLesson: () => void;
}

const useOpeningLessonStore = create<OpeningLessonStore>(set => ({
    startLesson(deviation, line) {
        set({
            lesson: {
                deviation: deviation,
                line: line,
                progress: 0,
                expectedFen: deviation.parentFen,
                status: LessonStatus.ACTIVE
            }
        });
    },

    advanceLesson(newExpectedFen) {
        set(state => {
            if (!state.lesson) return state;

            const progress = state.lesson.progress + 1;

            return {
                lesson: {
                    ...state.lesson,
                    progress: progress,
                    expectedFen: newExpectedFen,
                    status: progress >= state.lesson.line.length
                        ? LessonStatus.COMPLETED
                        : LessonStatus.ACTIVE
                }
            };
        });
    },

    stopLesson() {
        set({ lesson: undefined });
    }
}));

export default useOpeningLessonStore;
