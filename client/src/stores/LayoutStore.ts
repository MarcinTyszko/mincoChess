import { create } from "zustand";

interface LayoutStore {
    topSectionHeight: number;
    contentSectionHeight: number;

    analysisBoardContainerWidth: number;
    analysisBoardWidth: number;

    analysisPanelScrollable: boolean;

    setTopSectionHeight: (height: number) => void;
    setContentSectionHeight: (height: number) => void;

    setAnalysisBoardContainerWidth: (width: number) => void;
    setAnalysisBoardWidth: (height: number) => void;

    setAnalysisPanelScrollable: (scrollable: boolean) => void;
}

const useLayoutStore = create<LayoutStore>(set => ({
    topSectionHeight: 0,
    contentSectionHeight: 0,

    analysisBoardContainerWidth: 0,
    analysisBoardWidth: 0,

    analysisPanelScrollable: false,

    setTopSectionHeight(height) {
        set({ topSectionHeight: height });
    },

    setContentSectionHeight(height) {
        set({ contentSectionHeight: height });
    },

    setAnalysisBoardContainerWidth(width) {
        set({ analysisBoardContainerWidth: width });
    },

    setAnalysisBoardWidth(height) {
        set({ analysisBoardWidth: height });   
    },

    setAnalysisPanelScrollable(scrollable) {
        set({ analysisPanelScrollable: scrollable });
    }
}));

export default useLayoutStore;