import { create } from "zustand";

import Breakpoints from "@constants/Breakpoints";

interface SidebarStore {
    sidebarOpen: boolean;
    
    setSidebarOpen: (newValue: boolean) => void;
}

const useSidebarStore = create<SidebarStore>(set => ({
    sidebarOpen: innerWidth >= Breakpoints.RETRACT_SIDEBAR,

    setSidebarOpen(newValue: boolean) {
        set({ sidebarOpen: newValue });
    }
}));

export default useSidebarStore;