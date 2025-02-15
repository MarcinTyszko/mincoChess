import { createContext, Dispatch, SetStateAction } from "react";

interface AnalysisProgress {
    analysisProgress: number;
    setAnalysisProgress: Dispatch<SetStateAction<number>>;
}

const AnalysisProgressContext = createContext<AnalysisProgress>({
    analysisProgress: 0,
    setAnalysisProgress: () => undefined
});

export default AnalysisProgressContext;