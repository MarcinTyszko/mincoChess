import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

import { getNewsArticle } from "@lib/newsArticles";
import { formatDate } from "@lib/utils/date";

import * as styles from "./Article.module.css";

function Article() {
    const { t } = useTranslation();
    const { articleId } = useParams();

    const { data: article, status } = useQuery({
        queryKey: ["newsArticle", articleId],
        queryFn: () => getNewsArticle(articleId || "")
    });

    return <div className={styles.wrapper}>
        {
            status == "success"
            && <>
                <span className={styles.title}>
                    {article.title}
                </span>

                <span className={styles.date}>
                    {formatDate(new Date(article.date))}
                </span>

                <ReactMarkdown>
                    {article.content}
                </ReactMarkdown>
            </>
        }

        {
            status == "error"
            && <span className={styles.error}>
                {t("pages.news.article.error")}
            </span>
        }
    </div>;
}

export default Article;