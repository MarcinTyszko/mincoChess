import { create } from "zustand";

interface AnalysisProgressStore {
    analysisProgress: number;

    setAnalysisProgress: (progress: number) => void;
}

const useAnalysisProgressStore = create<AnalysisProgressStore>(set => ({
    analysisProgress: 0,

    setAnalysisProgress(progress) {
        set({ analysisProgress: progress });
    }
}));

export default useAnalysisProgressStore;