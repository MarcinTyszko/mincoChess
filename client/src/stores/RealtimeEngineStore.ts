import { create } from "zustand";

import { EngineLine } from "wintrchess";

interface RealtimeEngineStore {
    realtimeEngineDepth: number;
    realtimeEngineLines: EngineLine[];
    displayedEngineLines: EngineLine[];

    setRealtimeEngineDepth: (depth: number) => void;
    setRealtimeEngineLines: (lines: EngineLine[]) => void;
    setDisplayedEngineLines: (lines: EngineLine[]) => void;
}

const useRealtimeEngineStore = create<RealtimeEngineStore>(set => ({
    realtimeEngineDepth: 0,
    realtimeEngineLines: [],
    displayedEngineLines: [],

    setRealtimeEngineDepth(depth) {
        set({ realtimeEngineDepth: depth });
    },

    setRealtimeEngineLines(lines) {
        set({ realtimeEngineLines: lines });   
    },

    setDisplayedEngineLines(lines) {
        set({ displayedEngineLines: lines });
    }
}));

export default useRealtimeEngineStore;