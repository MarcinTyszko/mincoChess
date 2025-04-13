import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

import { formatDate } from "wintrchess";
import ErrorMessage from "@components/common/ErrorMessage";
import { getNewsArticle } from "@lib/newsArticles";
import Unfound from "@pages/Unfound";

import * as styles from "./Article.module.css";

function Article() {
    const { t } = useTranslation();

    const { articleId } = useParams();

    const { data: article, status } = useQuery({
        queryKey: ["newsArticle", articleId],
        queryFn: () => getNewsArticle(articleId || "")
    });

    console.log(article?.content);

    return <div className={styles.wrapper}>
        {
            article
            && <div className={styles.articleContainer}>
                <div
                    className={styles.tag}
                    style={{
                        backgroundColor: `${article.tag.colour}4c`,
                        borderColor: `${article.tag.colour}ab`
                    }}
                >
                    {article.tag.name}
                </div>

                {
                    article.thumbnail
                    && <img src={article.thumbnail} />
                }

                <span className={styles.title}>
                    {article.title}
                </span>

                <span className={styles.date}>
                    {formatDate(new Date(article.timestamp))}
                </span>

                <hr className={styles.separator}/>

                <ReactMarkdown
                    className={styles.content}
                    urlTransform={value => value}
                >
                    {article.content}
                </ReactMarkdown>
            </div>
        }

        {
            status == "error"
            && <ErrorMessage>
                {t("pages.news.article.error")}
            </ErrorMessage>
        }

        {
            status == "success" && article == null
            && <Unfound/>
        }
    </div>;
}

export default Article;