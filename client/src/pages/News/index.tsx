import React from "react";
import { useTranslation } from "react-i18next";

import ArticleListing from "@components/news/ArticleListing";

import * as styles from "./News.module.css";

function News() {
    const { t } = useTranslation();

    return <div className={styles.wrapper}>
        <div className={styles.title}>
            <img src={require("@assets/img/news.png")} height="50"/>
            <span>{t("pages.news.title")}</span>
        </div>  

        <ArticleListing 
            category="📝 Update"
            categoryColour="#1e78ff"
            date={new Date()}
        >
            Complete overhaul of Game Report is now released!
        </ArticleListing>
    </div>;
}

export default News;