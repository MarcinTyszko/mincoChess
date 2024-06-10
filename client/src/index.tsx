import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Analysis from "@pages/Analysis";
import NavigationBar from "@components/common/NavigationBar";
import Sidebar from "@components/common/sidebar/Sidebar";

import "./index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

root.render(
    <BrowserRouter>
        <NavigationBar/>
        <Sidebar/>
        <Routes>
            <Route path="/" element={<Analysis/>}/>
        </Routes>
    </BrowserRouter>
);