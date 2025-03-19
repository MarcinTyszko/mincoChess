import { create } from "zustand";

interface AnalysisSessionStore {
    analysisSessionToken?: string;

    setAnalysisSessionToken: (token?: string) => void;
}

const useAnalysisSessionStore = create<AnalysisSessionStore>(set => ({
    setAnalysisSessionToken(token) {
        set({ analysisSessionToken: token });   
    }
}));

export default useAnalysisSessionStore;