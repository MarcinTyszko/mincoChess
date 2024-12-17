import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Button from "@components/common/Button";
import ConfirmDialog from "@components/common/ConfirmDialog";
import { formatDate } from "@lib/utils/date";

import ArticleListingProps from "./ArticleListingProps";
import * as styles from "./ArticleListing.module.css";

function ArticleListing({ article, editable }: ArticleListingProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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

    return <div
        className={styles.wrapper}
        onClick={() => navigate(`/news/${article.id}`)}
    >
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
                {formatDate(new Date(article.timestamp))}
            </span>
        </div>

        {article.title}

        {
            editable
            && <div className={styles.toolbar}>
                <Button
                    icon={require("@assets/img/delete.svg")}
                    onClick={event => {
                        event.stopPropagation();
                        setDeleteConfirmOpen(true);
                    }}
                />

                <Button
                    icon={require("@assets/img/edit.svg")}
                    onClick={event => {
                        event.stopPropagation();
                        navigate(`/internal/dashboard/news/edit?id=${article.id}`);
                    }}
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