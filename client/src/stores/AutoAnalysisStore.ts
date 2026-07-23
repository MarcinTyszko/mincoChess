import { create } from "zustand";

import Game from "shared/types/game/Game";

export type AutoAnalysisStatus = "queued" | "analysing" | "done" | "error";

export interface AutoAnalysisEntry {
    /** Game identity key from getGameKey() */
    key: string;
    game: Game;
    status: AutoAnalysisStatus;
    /** Evaluation progress from 0 to 1 */
    progress: number;
    /** Archive entry ID once the analysed game has been saved */
    archiveId?: string;
    /** Player accuracies once the analysis has finished */
    accuracies?: Game["accuracies"];
    /** Failure reason when status is "error", for display and debugging */
    error?: string;
}

interface AutoAnalysisStore {
    /** Whether the queue runner has started this page load */
    started: boolean;
    entries: AutoAnalysisEntry[];

    setStarted: (started: boolean) => void;
    setEntries: (entries: AutoAnalysisEntry[]) => void;
    updateEntry: (
        key: string,
        update: Partial<Omit<AutoAnalysisEntry, "key" | "game">>
    ) => void;
}

/**
 * @description Queue of the signed-in user's recent games being analysed
 * automatically in the background; read by the profile page to display
 * per-game progress.
 */
const useAutoAnalysisStore = create<AutoAnalysisStore>(set => ({
    started: false,
    entries: [],

    setStarted(started) {
        set({ started });
    },

    setEntries(entries) {
        set({ entries });
    },

    updateEntry(key, update) {
        set(state => ({
            entries: state.entries.map(entry => entry.key == key
                ? { ...entry, ...update }
                : entry
            )
        }));
    }
}));

export default useAutoAnalysisStore;
