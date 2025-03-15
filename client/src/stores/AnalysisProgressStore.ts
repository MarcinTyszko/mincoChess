import { create } from "zustand";

interface AnalysisProgressStore {
    analysisProgress: number;
    analysisError?: string;

    setAnalysisProgress: (progress: number) => void;
    setAnalysisError: (error: string) => void;
}

const useAnalysisProgressStore = create<AnalysisProgressStore>(set => ({
    analysisProgress: 1,

    setAnalysisProgress(progress) {
        set({ analysisProgress: progress });
    },

    setAnalysisError(error) {
        set({ analysisError: error });
    }
}));

export default useAnalysisProgressStore;