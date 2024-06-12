import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@components/common/PageWrapper";
import Analysis from "@pages/Analysis";
import Unfound from "@pages/Unfound";

import "./index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

root.render(
    <BrowserRouter>
        <PageWrapper>
            <Routes>
                <Route path="/" element={<Analysis/>} />

                <Route path="*" element={<Unfound/>} />
            </Routes>
        </PageWrapper>
    </BrowserRouter>
);