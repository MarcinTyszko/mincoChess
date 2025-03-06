import { create } from "zustand";

import { EngineLine } from "wintrchess";

interface RealtimeEngineStore {
    realtimeEngineDepth: number;
    realtimeEngineLines: EngineLine[];
    displayedEngineDepth: number;
    displayedEngineLines: EngineLine[];

    setRealtimeEngineDepth: (depth: number) => void;
    setRealtimeEngineLines: (lines: EngineLine[]) => void;
    setDisplayedEngineDepth: (depth: number) => void;
    setDisplayedEngineLines: (lines: EngineLine[]) => void;
}

/**
 * @description The real-time engine data concurs exactly with the underlying
 * engine. The displayed engine data may sometimes be merged with existing
 * cache on the current state tree node.
 */
const useRealtimeEngineStore = create<RealtimeEngineStore>(set => ({
    realtimeEngineDepth: 0,
    realtimeEngineLines: [],
    displayedEngineDepth: 0,
    displayedEngineLines: [],

    setRealtimeEngineDepth(depth) {
        set({ realtimeEngineDepth: depth });
    },

    setRealtimeEngineLines(lines) {
        set({ realtimeEngineLines: lines });
    },

    setDisplayedEngineDepth(depth) {
        set({ displayedEngineDepth: depth });
    },

    setDisplayedEngineLines(lines) {
        set({ displayedEngineLines: lines });
    }
}));

export default useRealtimeEngineStore;