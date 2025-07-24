import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import PageWrapper from "@/components/layout/PageWrapper";
import Credits from "./pages/Credits";
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

    return <PageWrapper>
        <Credits/>
    </PageWrapper>;
}

root.render(<App/>);