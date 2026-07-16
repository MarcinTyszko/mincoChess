import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";
import Profile from "./pages/Profile";
import { removeDefaultConsentLink } from "@/lib/consent";

import "@/i18n";
import "@/index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

function App() {
    useEffect(() => {
        removeDefaultConsentLink();
    }, []);

    return <BrowserRouter>
        <PageWrapper>
            <Suspense fallback={<LoadingPlaceholder/>}>
                <Routes>
                    <Route path="/profile/:username" element={<Profile/>} />
                </Routes>
            </Suspense>
        </PageWrapper>
    </BrowserRouter>;
}

root.render(<App/>);