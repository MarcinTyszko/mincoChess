import { create } from "zustand";

interface LayoutStore {
    topSectionHeight: number;
    contentSectionHeight: number;
    analysisBoardContainerWidth: number;

    setTopSectionHeight: (height: number) => void;
    setContentSectionHeight: (height: number) => void;
    setAnalysisBoardContainerWidth: (width: number) => void;
}

const useLayoutStore = create<LayoutStore>(set => ({
    topSectionHeight: 0,
    contentSectionHeight: 0,
    analysisBoardContainerWidth: 0,

    setTopSectionHeight(height) {
        set({ topSectionHeight: height });
    },

    setContentSectionHeight(height) {
        set({ contentSectionHeight: height });
    },

    setAnalysisBoardContainerWidth(width) {
        set({ analysisBoardContainerWidth: width });
    }
}));

export default useLayoutStore;