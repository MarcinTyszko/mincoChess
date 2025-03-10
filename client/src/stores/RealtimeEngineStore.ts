import { create } from "zustand";

import { EngineLine } from "wintrchess";

interface RealtimeEngineStore {
    displayedEngineLines: EngineLine[];

    setDisplayedEngineLines: (lines: EngineLine[]) => void;
}

const useRealtimeEngineStore = create<RealtimeEngineStore>(set => ({
    displayedEngineLines: [],

    setDisplayedEngineLines(lines) {
        set({ displayedEngineLines: lines });
    }
}));

export default useRealtimeEngineStore;