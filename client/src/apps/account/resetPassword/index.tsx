import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PageWrapper from "@/components/layout/PageWrapper";
import PasswordDialog from "./components/PasswordDialog";
import { removeDefaultConsentLink } from "@/lib/consent";

import "@/i18n";
import "@/index.css";

import * as styles from "./index.module.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

const queryClient = new QueryClient();

function App() {
    useEffect(() => {
        removeDefaultConsentLink();
    }, []);

    return <QueryClientProvider client={queryClient}>
        <PageWrapper contentClassName={styles.content}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/auth/reset-password"
                        element={<PasswordDialog/>}
                    />
                </Routes>
            </BrowserRouter>
        </PageWrapper>
    </QueryClientProvider>;
}

root.render(<App/>);