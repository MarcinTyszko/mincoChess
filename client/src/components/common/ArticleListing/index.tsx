import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { formatDate } from "wintrchess";
import Button from "@components/common/Button";
import ConfirmDialog from "@components/common/ConfirmDialog";

import ArticleListingProps from "./ArticleListingProps";
import * as styles from "./ArticleListing.module.css";

function ArticleListing({
    article,
    editable,
    hardReload
}: ArticleListingProps) {
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
        onClick={() => {
            if (hardReload) {
                location.href = `/news/${article.id}`;
            } else {
                navigate(`/news/${article.id}`);
            }
        }}
    >
        <div className={styles.thumbnailContainer}>
            {article.thumbnail
                ? <img
                    className={styles.thumbnail}
                    src={article.thumbnail}
                />
                : <img
                    src={require("@assets/img/logo.png")}
                    style={{
                        width: "25%",
                        filter: "brightness(0.3)"
                    }}
                />
            }
        </div>

        <span className={styles.articleTitle}>
            {article.title}
        </span>

        <span className={styles.date}>
            {formatDate(new Date(article.timestamp))}
        </span>

        <span
            className={styles.tag}
            style={{
                backgroundColor: `${article.tag.colour}4c`,
                borderColor: `${article.tag.colour}ab`
            }}
        >
            {article.tag.name}
        </span>

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