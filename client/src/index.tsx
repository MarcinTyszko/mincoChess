import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PageWrapper from "@components/layout/PageWrapper";
import LoadingPlaceholder from "@components/layout/LoadingPlaceholder";

const Analysis = lazy(() => import("@pages/Analysis"));
const Archive = lazy(() => import("@pages/Archive"));
const NewsArticleList = lazy(() => import("@pages/news/ArticleList"));
const NewsArticle = lazy(() => import("@pages/news/Article"));
const Settings = lazy(() => import("@pages/Settings"));

const HelpCenter = lazy(() => import("@pages/HelpCenter"));

const PrivacyPolicy = lazy(() => import("@pages/PrivacyPolicy"));

const Unfound = lazy(() => import("@pages/Unfound"));
const Credits = lazy(() => import("@pages/Credits"));

const Login = lazy(() => import("@pages/internal/Login"));
const Dashboard = lazy(() => import("@pages/internal/Dashboard"));
const Analytics = lazy(() => import("@pages/internal/Analytics"));
const ArticleList = lazy(() => import("@pages/internal/news/ArticleList"));
const ArticleEditor = lazy(() => import("@pages/internal/news/ArticleEditor"));
const AnnouncementEditor = lazy(() => import("@pages/internal/AnnouncementEditor"));

import "./i18n";
import "./index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

const queryClient = new QueryClient();

root.render(<BrowserRouter>
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

                    <Route path="/internal" element={<Navigate to="/internal/dashboard"/>} />

                    <Route path="/internal/login" element={<Login/>} />
                    <Route path="/internal/dashboard" element={<Dashboard/>}>
                        <Route index element={<Analytics/>} />
                        <Route path="analytics" element={<Analytics/>} />
                        <Route path="news" element={<ArticleList/>} />
                        <Route path="news/edit" element={<ArticleEditor/>} />
                        <Route path="announcement" element={<AnnouncementEditor/>} />
                    </Route>
                </Routes>
            </Suspense>
        </PageWrapper>
    </QueryClientProvider>
</BrowserRouter>);