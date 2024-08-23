import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import Button from "@components/common/Button";
import ConfirmDialog from "@components/common/ConfirmDialog";
import { formatDate } from "@lib/utils/date";

import ArticleListingProps from "./ArticleListingProps";
import * as styles from "./ArticleListing.module.css";

function ArticleListing({ article, editable }: ArticleListingProps) {
    const queryClient = useQueryClient();

    const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false);

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
                    onClick={() => setDeleteConfirmOpen(true)}
                />

                <Button
                    icon={require("@assets/img/edit.svg")}
                />
            </div>
        }

        {
            deleteConfirmOpen
            && <ConfirmDialog
                setDialogOpen={setDeleteConfirmOpen}
                onConfirm={deleteArticle}
                dangerAction
            >
                Are you sure you want to delete this news post?
            </ConfirmDialog>
        }
    </div>;
}

export default ArticleListing;