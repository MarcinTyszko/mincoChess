import React, { lazy, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAltcha } from "@hooks/useAltcha";
import PageWrapper from "@components/layout/PageWrapper";
import { removeDefaultConsentLink } from "@lib/consent";

import * as styles from "./index.module.css";

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
        removeDefaultConsentLink();
        executeCaptcha();
    }, []);

    return <QueryClientProvider client={queryClient}>
        <PageWrapper
            className={styles.wrapper}
            footerClassName={styles.footer}
        >
            <Analysis/>
        </PageWrapper>
    </QueryClientProvider>;
}

root.render(<App/>);