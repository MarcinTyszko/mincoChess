import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
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
        <Routes>
            <PageWrapper>
                <Route path="/profile/:username" element={<Profile/>} />
            </PageWrapper>
        </Routes>
    </BrowserRouter>;
}

root.render(<App/>);