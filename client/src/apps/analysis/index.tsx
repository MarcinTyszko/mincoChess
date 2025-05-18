import React, { lazy, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAltcha } from "@hooks/useAltcha";
import PageWrapper from "@components/layout/PageWrapper";

const Analysis = lazy(() => import("./pages/Analysis"));

import "@i18n";
import "../../index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

const queryClient = new QueryClient();

function App() {
    const executeCaptcha = useAltcha();

    useEffect(() => {
        executeCaptcha();
    }, []);

    return <QueryClientProvider client={queryClient}>
        <PageWrapper>
            <Analysis/>
        </PageWrapper>
    </QueryClientProvider>;
}

root.render(<App/>);