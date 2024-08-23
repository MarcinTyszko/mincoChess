import React from "react";
import { useQueryClient } from "@tanstack/react-query";

import Button from "@components/common/Button";
import { formatDate } from "@lib/utils/date";

import ArticleListingProps from "./ArticleListingProps";
import * as styles from "./ArticleListing.module.css";

function ArticleListing({ article, editable }: ArticleListingProps) {
    const queryClient = useQueryClient();

    async function deleteArticle() {
        await fetch("/internal/news/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: article.id
            })
        });

        queryClient.refetchQueries({
            queryKey: ["newsArticles"]
        });
    }

    return <div className={styles.wrapper}>
        <div className={styles.metadata}>
            <span
                className={styles.category}
                style={{
                    backgroundColor: article.tag.colour && `${article.tag.colour}4c`,
                    borderColor: `${article.tag.colour}ab`
                }}
            >
                {article.tag.name}
            </span>

            <span className={styles.date}>
                {formatDate(new Date(article.date))}
            </span>
        </div>

        {article.title}

        {
            editable
            && <div className={styles.toolbar}>
                <Button
                    icon={require("@assets/img/delete.svg")}
                    onClick={deleteArticle}
                />

                <Button
                    icon={require("@assets/img/edit.svg")}
                />
            </div>
        }
    </div>;
}

export default ArticleListing;