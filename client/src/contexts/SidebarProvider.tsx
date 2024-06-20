import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

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
    const [ sidebarOpen, setSidebarOpen ] = useState<boolean>(false);

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