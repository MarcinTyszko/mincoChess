import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import Catalog from "./pages/Catalog";
import OpeningFamilyPage from "./pages/OpeningFamilyPage";

import "@/i18n";
import "@/index.css";

import * as styles from "./index.module.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

function App() {
    return <PageWrapper contentClassName={styles.wrapper}>
        <BrowserRouter>
            <Routes>
                <Route path="/learning" element={<Catalog/>} />

                <Route
                    path="/learning/opening/:family"
                    element={<OpeningFamilyPage/>}
                />
            </Routes>
        </BrowserRouter>
    </PageWrapper>;
}

root.render(<App/>);
