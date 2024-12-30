import { create } from "zustand";

import { GameReport } from "wintrchess";

interface GameReportStore {
    report?: GameReport;

    setReport(newReport: GameReport): void;
}

const useGameReportStore = create<GameReportStore>(set => ({
    setReport(report: GameReport) {
        set({ report });
    }
}));

export default useGameReportStore;