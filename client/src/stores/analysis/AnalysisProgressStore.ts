import { create } from "zustand";

import AnalysisStatus from "@constants/AnalysisStatus";

interface AnalysisProgressStore {
    evaluationProgress: number;
    analysisStatus: AnalysisStatus;
    analysisError?: string;

    setEvaluationProgress: (progress: number) => void;
    setAnalysisStatus: (status: AnalysisStatus) => void;
    setAnalysisError: (error?: string) => void;
}

const useAnalysisProgressStore = create<AnalysisProgressStore>(set => ({
    evaluationProgress: 0,
    analysisStatus: AnalysisStatus.INACTIVE,

    setEvaluationProgress(progress) {
        set({ evaluationProgress: progress });
    },

    setAnalysisStatus(status) {
        set({ analysisStatus: status });
    },

    setAnalysisError(error) {
        set({ analysisError: error });
    }
}));

export default useAnalysisProgressStore;