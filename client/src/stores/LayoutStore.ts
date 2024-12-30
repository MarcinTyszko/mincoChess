import { create } from "zustand";

interface LayoutStore {
    topSectionHeight: number;
    contentSectionHeight: number;
    analysisBoardContainerWidth: number;

    setTopSectionHeight(height: number): void;
    setContentSectionHeight(height: number): void;
    setAnalysisBoardContainerWidth(width: number): void;
}

const useLayoutStore = create<LayoutStore>(set => ({
    topSectionHeight: 0,
    contentSectionHeight: 0,
    analysisBoardContainerWidth: 0,

    setTopSectionHeight(height: number) {
        set({ topSectionHeight: height });
    },

    setContentSectionHeight(height: number) {
        set({ contentSectionHeight: height });
    },

    setAnalysisBoardContainerWidth(width: number) {
        set({ analysisBoardContainerWidth: width });
    }
}));

export default useLayoutStore;