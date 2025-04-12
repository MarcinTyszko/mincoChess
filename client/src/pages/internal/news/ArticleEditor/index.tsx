import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

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
    const [ articleTitle, setArticleTitle ] = useState("");

    const [ thumbnailFile, setThumbnailFile ] = useState<File | undefined>();

    const [ tagName, setTagName ] = useState("");
    const [ tagColourPickerOpen, setTagColourPickerOpen ] = useState(false);
    const [ tagColour, setTagColour ] = useState("#000000");

    const [ articleContent, setArticleContent ] = useState("");

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

            // Update interface with article details
            setArticleTitle(article.title);
            setTagName(article.tag.name);
            setTagColour(article.tag.colour);
            setArticleContent(article.content);
        },
        refetchOnWindowFocus: false
    });

    async function publishArticle() {
        const article: NewsArticle = {
            id: queryParams.get("id") || undefined,
            thumbnail: thumbnailFile && await getDataURL(thumbnailFile),
            title: articleTitle,
            tag: {
                name: tagName,
                colour: tagColour
            },
            timestamp: Date.now(),
            content: articleContent
        };

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
        <div className={styles.metadata}>
            <TextField
                placeholder="Article title..."
                value={articleTitle}
                onChange={setArticleTitle}
                style={{ height: "45px" }}
            />

            <div className={styles.tagMetadata}>
                <TextField
                    placeholder="Tag name..."
                    value={tagName}
                    onChange={setTagName}
                    style={{ height: "45px" }}
                />

                <ColourSwatch
                    colour={tagColour}
                    setColour={setTagColour}
                    open={tagColourPickerOpen}
                    setOpen={setTagColourPickerOpen}
                />
            </div>

            <FileUploader
                extensions={[".png"]}
                onFilesUpload={files => {
                    const file = files.item(0);
                    if (!file) return;

                    setThumbnailFile(file);
                }}
            >
                <div className={styles.thumbnailUploader}>
                    <Button style={{
                        backgroundColor: "var(--ui-shade-4)"
                    }}>
                        Upload Thumbnail
                    </Button>

                    <span style={{ overflowWrap: "anywhere" }}>
                        {thumbnailFile?.name}
                    </span>
                </div>
            </FileUploader>
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
                    onChange={event => setArticleContent(event.target.value)}
                    value={articleContent}
                    placeholder="Markdown..."
                ></textarea>
            }
            
            {
                articleFormat == "preview"
                && <ReactMarkdown className={styles.editorContent}>
                    {articleContent}
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