import { create } from "zustand";

import AnalysisStatus from "@constants/AnalysisStatus";

interface EvaluationProgressStore {
    evaluationProgress: number;
    analysisStatus: AnalysisStatus;
    analysisTooltip?: string;
    analysisError?: string;
    analysisCaptchaToken?: string;

    setEvaluationProgress: (progress: number) => void;
    setAnalysisStatus: (status: AnalysisStatus) => void;

    setAnalysisTooltip: (tooltip?: string) => void;
    setAnalysisError: (error?: string) => void;

    setAnalysisCaptchaToken: (token?: string) => void;
}

const useEvaluationProgressStore = create<EvaluationProgressStore>(set => ({
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
    },

    setAnalysisCaptchaToken(token) {
        set({ analysisCaptchaToken: token });
    }
}));

export default useEvaluationProgressStore;