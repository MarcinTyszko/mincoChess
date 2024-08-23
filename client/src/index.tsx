import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageWrapper from "@components/layout/PageWrapper";
import LoadingPlaceholder from "@components/layout/LoadingPlaceholder";

const Analysis = lazy(() => import("@pages/Analysis"));
const Archive = lazy(() => import("@pages/Archive"));
const News = lazy(() => import("@pages/News"));
const Unfound = lazy(() => import("@pages/Unfound"));

const Login = lazy(() => import("@pages/admin/Login"));
const Dashboard = lazy(() => import("@pages/admin/Dashboard"));
const Analytics = lazy(() => import("@pages/admin/Analytics"));
const ArticleList = lazy(() => import("@pages/admin/news/ArticleList"));
const ArticleEditor = lazy(() => import("@pages/admin/news/ArticleEditor"));

import "./i18n";
import "./index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

root.render(<BrowserRouter>
    <PageWrapper>
        <Suspense fallback={<LoadingPlaceholder/>}>
            <Routes>
                <Route path="/" element={<Analysis/>} />
                <Route path="/archive" element={<Archive/>}/>

                <Route path="/news" element={<News/>} />
                <Route path="*" element={<Unfound/>} />

                <Route path="/internal/login" element={<Login/>} />
                <Route path="/internal/dashboard" element={<Dashboard/>}>
                    <Route index element={<Analytics/>}/>
                    <Route path="analytics" element={<Analytics/>}/>
                    <Route path="news" element={<ArticleList/>} />
                    <Route path="news/edit" element={<ArticleEditor/>} />
                </Route>
            </Routes>
        </Suspense>
    </PageWrapper>
</BrowserRouter>);