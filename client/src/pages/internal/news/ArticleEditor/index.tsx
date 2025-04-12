import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { produce } from "immer";

import { NewsArticle } from "wintrchess";
import useProtectedRoute from "@hooks/useProtectedRoute";
import Button from "@components/common/Button";
import ColourSwatch from "@components/common/ColourSwatch";
import ButtonColour from "@constants/ButtonColour";
import TextField from "@components/common/TextField";
import { getDataURL, FileUploader } from "@components/common/FileUploader";
import ConfirmDialog from "@components/common/ConfirmDialog";

import * as styles from "./ArticleEditor.module.css";

type ArticleFormat = "edit" | "preview";

function ArticleEditor() {
    useProtectedRoute();

    const navigate = useNavigate();
    const [ queryParams ] = useSearchParams();

    // Article details
    const [ article, setArticle ] = useState<NewsArticle>({
        title: "",
        content: "",
        timestamp: Date.now(),
        tag: {
            name: "Article",
            colour: "var(--ui-shade-5)"
        }
    });

    const [ tagColourPickerOpen, setTagColourPickerOpen ] = useState(false);
    const [ thumbnailFile, setThumbnailFile ] = useState<File | undefined>();

    // Edit or preview mode setting
    const [ articleFormat, setArticleFormat ] = useState<ArticleFormat>("edit");

    // Is publish confirmation dialog open
    const [ publishConfirmOpen, setPublishConfirmOpen ] = useState(false);

    useQuery({
        queryKey: ["editedArticle"],
        queryFn: async () => {
            // Get existing article ID from URL
            const articleId = queryParams.get("id");
            if (!articleId) return;

            // Fetch for the article details
            const articleResponse = await fetch(`/api/news?id=${articleId}`);

            const article: NewsArticle = await articleResponse.json();
            if (!article) return;

            setArticle(article);
        },
        refetchOnWindowFocus: false
    });

    async function publishArticle() {
        await fetch("/internal/news/publish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(article)
        });

        navigate("/internal/dashboard/news");
    }

    return <div
        className={styles.wrapper}
        onClick={() => setTagColourPickerOpen(false)}
    >
        {
            article?.thumbnail
            && <div className={styles.thumbnailPreview}>
                <img
                    className={styles.thumbnail}
                    src={article.thumbnail}
                />
            </div>
        }

        <div className={styles.metadata}>
            <TextField
                placeholder="Article title..."
                value={article?.title}
                onChange={title => {
                    setArticle(produce(article, draft => {
                        draft.title = title;
                        return draft;
                    }));
                }}
                style={{ height: "45px" }}
            />

            <div className={styles.tagMetadata}>
                <TextField
                    placeholder="Tag name..."
                    value={article.tag.name}
                    onChange={tagName => {
                        setArticle(produce(article, draft => {
                            draft.tag.name = tagName;
                            return draft;
                        }));
                    }}
                    style={{ height: "45px" }}
                />

                <ColourSwatch
                    colour={article.tag.colour}
                    onColourChange={tagColour => {
                        setArticle(produce(article, draft => {
                            draft.tag.colour = tagColour;
                            return draft;
                        }));
                    }}
                    open={tagColourPickerOpen}
                    onToggle={setTagColourPickerOpen}
                />
            </div>

            <div className={styles.thumbnailUploader}>
                <FileUploader
                    extensions={[".png", ".jpg", ".jpeg", ".webp"]}
                    onFilesUpload={async files => {
                        const file = files.item(0);
                        if (!file) return;

                        setThumbnailFile(file);

                        const thumbnailURL = await getDataURL(file);
                        if (!thumbnailURL) return;

                        setArticle(produce(article, draft => {
                            draft.thumbnail = thumbnailURL;
                            return draft;
                        }));
                    }}
                >
                    <Button
                        icon={require("@assets/img/upload.svg")}
                        iconSize="25px"
                        style={{
                            backgroundColor: "var(--ui-shade-4)"
                        }}
                    >
                        Upload Thumbnail
                    </Button>
                </FileUploader>

                <span style={{ overflowWrap: "anywhere" }}>
                    {thumbnailFile?.name}
                </span>
            </div>

            <i style={{ color: "gray" }}>
                File limit: 10 MB
            </i>
        </div>

        <div className={styles.formatSelector}>
            <Button
                highlighted={articleFormat == "edit"}
                onClick={() => setArticleFormat("edit")}
                style={{
                    backgroundColor: "var(--ui-shade-4)"
                }}
            >
                Edit
            </Button>

            <Button
                highlighted={articleFormat == "preview"}
                onClick={() => setArticleFormat("preview")}
                style={{
                    backgroundColor: "var(--ui-shade-4)"
                }}
            >
                Preview
            </Button>
        </div>

        <div className={styles.editor}>
            {
                articleFormat == "edit"
                && <textarea
                    className={styles.editorContent}
                    onChange={event => {
                        setArticle(produce(article, draft => {
                            draft.content = event.target.value;
                            return draft;
                        }));
                    }}
                    value={article.content}
                    placeholder="Markdown..."
                ></textarea>
            }
            
            {
                articleFormat == "preview"
                && <ReactMarkdown className={styles.editorContent}>
                    {article.content}
                </ReactMarkdown>
            }
        </div>

        <Button
            icon={require("@assets/img/edit.svg")}
            style={{
                gap: "5px",
                backgroundColor: ButtonColour.BLUE
            }}
            onClick={() => setPublishConfirmOpen(true)}
        >
            Publish
        </Button>

        {
            publishConfirmOpen
            && <ConfirmDialog
                setDialogOpen={setPublishConfirmOpen}
                onConfirm={publishArticle}
            >
                Are you sure you want to publish this article?
            </ConfirmDialog>
        }
    </div>;
}

export default ArticleEditor;