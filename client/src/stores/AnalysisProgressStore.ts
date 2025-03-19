import { create } from "zustand";

import AnalysisStatus from "@constants/AnalysisStatus";

interface AnalysisProgressStore {
    evaluationProgress: number;
    analysisStatus: AnalysisStatus;
    analysisTooltip?: string;
    analysisError?: string;

    setEvaluationProgress: (progress: number) => void;
    setAnalysisStatus: (status: AnalysisStatus) => void;

    setAnalysisTooltip: (tooltip?: string) => void;
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

    setAnalysisTooltip(tooltip) {
        set({ analysisTooltip: tooltip });
    },

    setAnalysisError(error) {
        set({ analysisError: error });
    }
}));

export default useAnalysisProgressStore;