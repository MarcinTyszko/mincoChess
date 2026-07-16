import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
    LearningProgress,
    emptyLearningProgress,
    mergeLearningProgress
} from "shared/types/LearningProgress";
import { getActivityDateKey } from "shared/lib/learning/streaks";

interface LearningProgressStore extends LearningProgress {
    serverSynced: boolean;

    toggleFavourite: (familyName: string) => void;
    markVariationComplete: (variationId: string) => void;
    recordActivity: (amount?: number) => void;
    syncWithServer: () => Promise<void>;
}

const SAVE_DEBOUNCE_MILLISECONDS = 2000;

let saveTimeout: ReturnType<typeof setTimeout> | undefined;

function getProgress(store: LearningProgressStore): LearningProgress {
    return {
        favourites: store.favourites,
        completed: store.completed,
        activity: store.activity
    };
}

/**
 * @description Push local progress to the server (merged server-side);
 * silently does nothing for signed out users.
 */
function scheduleServerSave() {
    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
        const store = useLearningProgressStore.getState();
        if (!store.serverSynced) return;

        try {
            await fetch("/api/account/learning", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(getProgress(store))
            });
        } catch {
            // Offline or signed out; local storage still has the data
        }
    }, SAVE_DEBOUNCE_MILLISECONDS);
}

export const useLearningProgressStore = create<LearningProgressStore>()(
    persist(
        (set, get) => ({
            ...emptyLearningProgress,

            serverSynced: false,

            toggleFavourite(familyName) {
                set(state => ({
                    favourites: state.favourites.includes(familyName)
                        ? state.favourites.filter(
                            favourite => favourite != familyName
                        )
                        : [...state.favourites, familyName]
                }));

                scheduleServerSave();
            },

            markVariationComplete(variationId) {
                get().recordActivity();

                set(state => ({
                    completed: state.completed.includes(variationId)
                        ? state.completed
                        : [...state.completed, variationId]
                }));

                scheduleServerSave();
            },

            recordActivity(amount = 1) {
                const dateKey = getActivityDateKey();

                set(state => ({
                    activity: {
                        ...state.activity,
                        [dateKey]: (state.activity[dateKey] || 0) + amount
                    }
                }));

                scheduleServerSave();
            },

            async syncWithServer() {
                try {
                    const progressResponse = await fetch(
                        "/api/account/learning"
                    );

                    if (!progressResponse.ok) return;

                    const serverProgress: LearningProgress = (
                        await progressResponse.json()
                    );

                    set(state => ({
                        serverSynced: true,
                        ...mergeLearningProgress(
                            getProgress(state),
                            serverProgress
                        )
                    }));

                    scheduleServerSave();
                } catch {
                    // Signed out or offline; keep local progress only
                }
            }
        }),
        {
            name: "wintrchess-learning-progress",
            storage: createJSONStorage(() => localStorage),
            partialize: state => ({
                favourites: state.favourites,
                completed: state.completed,
                activity: state.activity
            })
        }
    )
);

export default useLearningProgressStore;
