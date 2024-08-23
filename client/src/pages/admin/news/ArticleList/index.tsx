import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import ArticleListing from "@components/news/ArticleListing";
import { getNewsArticles } from "@lib/newsArticles";
import useProtectedRoute from "@hooks/useProtectedRoute";

import * as styles from "./ArticleList.module.css";

function ArticleList() {
    useProtectedRoute();

    const navigate = useNavigate();

    const { data: newsArticles, status, error } = useQuery({
        queryKey: ["newsArticles"],
        queryFn: getNewsArticles,
        staleTime: Infinity
    });

    return <div className={styles.wrapper}>
        <Button
            icon={require("@assets/img/add.svg")}
            style={{
                backgroundColor: ButtonColour.BLUE,
                marginBottom: "20px"
            }}
            onClick={() => navigate("/internal/dashboard/news/edit")}
        >
            Compose News Post
        </Button>

        {
            status == "success"
            && newsArticles.map(article => (
                <ArticleListing article={article} editable />
            ))
        }

        {
            status == "error"
            && error.message
        }
    </div>;
}

export default ArticleList;