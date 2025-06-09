import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

import { formatDate } from "wintrchess";
import Loader from "@components/common/Loader";
import LogMessage from "@components/common/LogMessage";
import Advertisement from "@components/Advertisement";
import { getNewsArticle } from "@lib/api/newsArticles";

import * as styles from "./Article.module.css";

function Article() {
    const navigate = useNavigate();

    const { t } = useTranslation();

    const { articleId } = useParams();

    const { data: article, status } = useQuery({
        queryKey: ["newsArticle", articleId],
        queryFn: () => getNewsArticle(articleId || ""),
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (status == "success" && !article) {
            navigate("/404");
        }
    }, [status]);

    return <div className={styles.wrapper}>
        <Advertisement adUnitId="2270224474" style={{
            width: "min(800px, 100%)", height: "100px"
        }}/>

        <div className={styles.articleContainer}>
            {status == "pending"
                && <div className={styles.articleLoaderContainer}>
                    <Loader/>

                    <span>Loading...</span>
                </div>
            }

            {article && <>
                <div className={styles.tag} style={{
                    backgroundColor: `${article.tag.colour}4c`,
                    borderColor: `${article.tag.colour}ab`
                }}>
                    {article.tag.name}
                </div>

                {article.thumbnail && <img src={article.thumbnail} />}

                <span className={styles.title}>
                    {article.title}
                </span>

                <span className={styles.date}>
                    {formatDate(new Date(article.timestamp))}
                </span>

                <hr className={styles.separator} />

                <ReactMarkdown
                    className={styles.content}
                    urlTransform={value => value}
                >
                    {article.content}
                </ReactMarkdown>
            </>}
        </div>

        {status == "error"
            && <LogMessage>
                {t("pages.news.article.error")}
            </LogMessage>
        }

        <Advertisement adUnitId="6069259870" style={{
            width: "min(800px, 100%)", height: "100px"
        }}/>
    </div>;
}

export default Article;