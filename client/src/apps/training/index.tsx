import React, { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAltcha } from "@hooks/useAltcha";
import PageWrapper from "@components/layout/PageWrapper";
import LoadingPlaceholder from "@components/layout/LoadingPlaceholder";

const Analysis = lazy(() => import("./pages/Analysis"));
const Archive = lazy(() => import("./pages/Archive"));
const NewsArticleList = lazy(() => import("../../pages/news/ArticleList"));
const NewsArticle = lazy(() => import("../../pages/news/Article"));
const Settings = lazy(() => import("@pages/Settings"));

const HelpCenter = lazy(() => import("@pages/HelpCenter"));

const PrivacyPolicy = lazy(() => import("@pages/PrivacyPolicy"));
const Credits = lazy(() => import("../../pages/Credits"));

const Unfound = lazy(() => import("@pages/Unfound"));

import "@i18n";
import "../../index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

const queryClient = new QueryClient();

function App() {
    const executeCaptcha = useAltcha();

    useEffect(() => {
        executeCaptcha();
    }, []);

    return <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <PageWrapper>
                <Suspense fallback={<LoadingPlaceholder/>}>
                    <Routes>
                        <Route path="/" element={<Analysis/>} />
                        <Route path="/analysis" element={<Analysis/>} />
                        <Route path="/archive" element={<Archive/>} />
                        <Route path="/news" element={<NewsArticleList/>} />
                        <Route path="/news/:articleId" element={<NewsArticle/>} />
                        <Route path="/settings" element={<Settings/>} />
                        <Route path="/credits" element={<Credits/>} />

                        <Route path="/help" element={<HelpCenter/>} />

                        <Route path="/privacy" element={<PrivacyPolicy/>} />

                        <Route path="*" element={<Unfound/>} />
                    </Routes>
                </Suspense>
            </PageWrapper>
        </QueryClientProvider>
    </BrowserRouter>;
}

root.render(<App/>);