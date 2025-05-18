import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PageWrapper from "@components/layout/PageWrapper";
import Unfound from "./pages/Unfound";

import "@i18n";
import "../../index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

const queryClient = new QueryClient();

function App() {
    return <QueryClientProvider client={queryClient}>
        <PageWrapper>
            <Unfound/>
        </PageWrapper>
    </QueryClientProvider>;
}

root.render(<App/>);