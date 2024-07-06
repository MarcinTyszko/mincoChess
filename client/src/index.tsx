import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@components/layout/PageWrapper";
import LoadingPlaceholder from "@components/layout/LoadingPlaceholder";

const Analysis = lazy(() => import("@pages/Analysis"));
const Unfound = lazy(() => import("@pages/Unfound"));

import "./i18n";
import "./index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

root.render(
    <BrowserRouter>
        <PageWrapper>
            <Suspense fallback={<LoadingPlaceholder/>}>
                <Routes>
                    <Route path="/" element={<Analysis/>} />

                    <Route path="*" element={<Unfound/>} />
                </Routes>
            </Suspense>
        </PageWrapper>
    </BrowserRouter>
);