import { create } from "zustand";

import { EngineLine } from "wintrchess";

interface RealtimeEngineStore {
    realtimeEngineDepth: number;
    realtimeEngineLines: EngineLine[];

    setRealtimeEngineDepth: (depth: number) => void;
    setRealtimeEngineLines: (lines: EngineLine[]) => void;
}

const useRealtimeEngineStore = create<RealtimeEngineStore>(set => ({
    realtimeEngineDepth: 0,
    realtimeEngineLines: [],

    setRealtimeEngineDepth(depth) {
        set({ realtimeEngineDepth: depth });
    },

    setRealtimeEngineLines(lines) {
        set({ realtimeEngineLines: lines });   
    }
}));

export default useRealtimeEngineStore;