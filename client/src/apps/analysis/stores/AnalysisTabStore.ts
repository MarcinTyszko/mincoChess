import { create } from "zustand";

import AnalysisTab from "@apps/analysis/constants/AnalysisTab";

interface AnalysisTabStore {
    activeTab: AnalysisTab;

    setActiveTab: (tab: AnalysisTab) => void;
}

const useAnalysisTabStore = create<AnalysisTabStore>(set => ({
    activeTab: AnalysisTab.REPORT,

    setActiveTab(tab) {
        set({ activeTab: tab });
    }
}));

export default useAnalysisTabStore;