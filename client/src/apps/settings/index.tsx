import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PageWrapper from "@components/layout/PageWrapper";
import Settings from "./pages/Settings";
import { removeDefaultConsentLink } from "@lib/consent";

import "@i18n";
import "../../index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

const queryClient = new QueryClient();

function App() {
    useEffect(() => {
        removeDefaultConsentLink();
    }, []);

    return <QueryClientProvider client={queryClient}>
        <PageWrapper>
            <Settings/>
        </PageWrapper>
    </QueryClientProvider>;
}

root.render(<App/>);