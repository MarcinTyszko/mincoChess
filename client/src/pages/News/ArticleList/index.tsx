import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import ArticleListing from "@components/common/ArticleListing";
import { getNewsArticles } from "@lib/newsArticles";

import * as styles from "./News.module.css";

function News() {
    const { t } = useTranslation();

    const { data: newsArticles, status } = useQuery({
        queryKey: ["newsArticles"],
        queryFn: getNewsArticles
    });

    return <div className={styles.wrapper}>
        <div className={styles.title}>
            <img src={require("@assets/img/news.png")} height="50"/>

            <span>
                {t("pages.news.title")}
            </span>
        </div>  

        <div className={styles.articles}>
            {
                status == "success"
                && newsArticles.map(
                    article => <ArticleListing article={article}/>
                )
            }

            {
                status == "error"
                && <span className={styles.error}>
                    {t("pages.news.error")}
                </span>
            }
        </div>
    </div>;
}

export default News;