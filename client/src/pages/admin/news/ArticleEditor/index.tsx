import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import useProtectedRoute from "@hooks/useProtectedRoute";

import * as styles from "./ArticleEditor.module.css";

type ArticleFormat = "edit" | "preview";

function ArticleEditor() {
    useProtectedRoute();

    const [ articleFormat, setArticleFormat ] = useState<ArticleFormat>("edit");
    const [ articleContent, setArticleContent ] = useState("");

    function publishArticle() {
        
    }

    return <div className={styles.wrapper}>
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
                && <div
                    className={styles.editorContent}
                >
                    <ReactMarkdown>
                        {articleContent}
                    </ReactMarkdown>
                </div>
            }
        </div>

        <Button
            icon={require("@assets/img/edit.svg")}
            style={{
                gap: "5px",
                backgroundColor: ButtonColour.BLUE
            }}
            onClick={publishArticle}
        >
            Publish
        </Button>
    </div>;
}

export default ArticleEditor;