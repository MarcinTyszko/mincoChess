import React, { lazy, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PageWrapper from "@/components/layout/PageWrapper";
import { removeDefaultConsentLink } from "@/lib/consent";

const ArticleList = lazy(() => import("./pages/ArticleList"));
const Article = lazy(() => import("./pages/Article"));

import "@/i18n";
import "@/index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

const queryClient = new QueryClient();

function App() {
    useEffect(() => {
        removeDefaultConsentLink();
    }, []);

    return <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <PageWrapper>
                <Routes>
                    <Route path="/news" element={<ArticleList/>} />
                    <Route path="/news/:articleId" element={<Article/>} />
                </Routes>
            </PageWrapper>
        </QueryClientProvider>
    </BrowserRouter>;
}

root.render(<App/>);