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

        
    </div>;
}

export default News;