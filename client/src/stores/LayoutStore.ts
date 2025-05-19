import { create } from "zustand";

interface LayoutStore {
    topSectionHeight: number;
    contentSectionWidth: number;
    contentSectionHeight: number;

    analysisBoardContainerWidth: number;
    analysisBoardWidth: number;

    analysisPanelScrollable: boolean;

    setTopSectionHeight: (height: number) => void;
    setContentSectionWidth: (width: number) => void;
    setContentSectionHeight: (height: number) => void;

    setAnalysisBoardContainerWidth: (width: number) => void;
    setAnalysisBoardWidth: (height: number) => void;

    setAnalysisPanelScrollable: (scrollable: boolean) => void;
}

const useLayoutStore = create<LayoutStore>(set => ({
    topSectionHeight: 0,
    contentSectionWidth: 0,
    contentSectionHeight: 0,

    analysisBoardContainerWidth: 0,
    analysisBoardWidth: 0,

    analysisPanelScrollable: false,

    setTopSectionHeight(height) {
        set({ topSectionHeight: height });
    },

    setContentSectionWidth(width) {
        set({ contentSectionWidth: width });
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