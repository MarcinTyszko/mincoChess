import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { HexColorPicker } from "react-colorful";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import TextField from "@components/common/TextField";
import ConfirmDialog from "@components/common/ConfirmDialog";
import useProtectedRoute from "@hooks/useProtectedRoute";

import * as styles from "./ArticleEditor.module.css";

type ArticleFormat = "edit" | "preview";

function ArticleEditor() {
    useProtectedRoute();

    const navigate = useNavigate();

    const [ articleTitle, setArticleTitle ] = useState("");
    const [ tagName, setTagName ] = useState("");

    const [ tagColourPickerOpen, setTagColourPickerOpen ] = useState(false);
    const [ tagColour, setTagColour ] = useState("#000000");

    const [ articleFormat, setArticleFormat ] = useState<ArticleFormat>("edit");
    const [ articleContent, setArticleContent ] = useState("");

    const [ publishConfirmOpen, setPublishConfirmOpen ] = useState(false);

    async function publishArticle() {
        await fetch("/internal/news/publish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: articleTitle,
                tag: {
                    name: tagName,
                    colour: tagColour
                },
                date: new Date().toISOString(),
                content: articleContent
            })
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
                style={{
                    height: "40px"
                }}
                onChange={value => setArticleTitle(value)}
            />

            <div className={styles.tagMetadata}>
                <TextField
                    placeholder="Tag name..."
                    style={{
                        height: "40px"
                    }}
                    onChange={value => setTagName(value)}
                />

                <div
                    className={styles.swatch}
                    style={{
                        backgroundColor: tagColour
                    }}
                    onClick={event => {
                        setTagColourPickerOpen(!tagColourPickerOpen);
                        event.stopPropagation();
                    }}
                ></div>

                {
                    tagColourPickerOpen
                    && <HexColorPicker
                        style={{
                            position: "absolute",
                            top: "50px",
                            right: "0",
                            zIndex: 1
                        }}
                        onChange={setTagColour}
                        onClick={event => event.stopPropagation()}
                    />
                }
            </div>
        </div>

        <div className={styles.formatSelector}>
            <Button
                highlighted={articleFormat == "edit"}
                onClick={() => setArticleFormat("edit")}
            >
                Edit
            </Button>

            <Button
                highlighted={articleFormat == "preview"}
                onClick={() => setArticleFormat("preview")}
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