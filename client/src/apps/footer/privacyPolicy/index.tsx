import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import PageWrapper from "@/components/layout/PageWrapper";
import PrivacyPolicy from "./pages/PrivacyPolicy";
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
        <PrivacyPolicy/>
    </PageWrapper>;
}

root.render(<App/>);