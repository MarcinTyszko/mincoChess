import React, { 
    Dispatch,
    SetStateAction,
    ReactNode,
    createContext, 
    useState 
} from "react";

import Breakpoints from "@constants/Breakpoints";

interface SidebarProviderProps {
    children: ReactNode;
}

interface SidebarContextType {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType>({
    sidebarOpen: false,
    setSidebarOpen: () => null
});

function SidebarProvider({ children }: SidebarProviderProps) {
    const [ sidebarOpen, setSidebarOpen ] = useState<boolean>(
        window.innerWidth >= Breakpoints.RETRACT_SIDEBAR
    );

    return <SidebarContext.Provider value={{
        sidebarOpen, setSidebarOpen
    }}>
        {children}
    </SidebarContext.Provider>;
}

export {
    SidebarContext,
    SidebarProvider
};