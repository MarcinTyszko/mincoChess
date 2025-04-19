import React, { useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clamp } from "lodash";

import Loader from "@components/common/Loader";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import ArticleListing from "@components/common/ArticleListing";
import ErrorMessage from "@components/common/ErrorMessage";
import { getNewsArticles, getNewsArticlesPages } from "@lib/newsArticles";

import * as styles from "./ArticleList.module.css";

function ArticleList() {
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const [ searchParams, setSearchParams ] = useSearchParams();

    const pageRef = useRef(
        parseInt(searchParams.get("page") || "1") || 1
    );

    const pageButtonsRef = useRef<HTMLDivElement>(null);

    const { data: newsArticles, status, error } = useQuery({
        queryKey: ["newsArticles"],
        queryFn: () => getNewsArticles(pageRef.current)
    });

    const { data: pageCount } = useQuery({
        queryKey: ["newsArticlesPages"],
        queryFn: getNewsArticlesPages
    });

    useEffect(() => {
        pageButtonsRef.current?.scrollIntoView();
    }, [pageRef.current]);

    async function switchPage(increment: number) {
        const newPage = clamp(
            pageRef.current + increment,
            1,
            pageCount || Infinity
        );

        pageRef.current = newPage;

        await queryClient.refetchQueries({
            queryKey: ["newsArticles"]
        });

        setSearchParams({ page: newPage.toString() });
    }

    return <div className={styles.wrapper}>
        <Button
            icon={require("@assets/img/interface/add.svg")}
            style={{
                backgroundColor: ButtonColour.BLUE
            }}
            onClick={() => navigate("/internal/dashboard/news/edit")}
        >
            Compose News Post
        </Button>

        <div className={styles.articles}>
            {
                status == "pending"
                && <Loader style={{ margin: "20px 0" }} />
            }

            {
                status == "success"
                && newsArticles.map(article => (
                    <ArticleListing
                        article={article}
                        editable
                        hardReload
                    />
                ))
            }

            {
                status == "error"
                && <ErrorMessage>
                    {error.message}
                </ErrorMessage>
            }
        </div>

        <div className={styles.pageButtons} ref={pageButtonsRef}>
            <Button
                style={{
                    backgroundColor: ButtonColour.BLUE
                }}
                icon={require("@assets/img/interface/back.svg")}
                onClick={() => switchPage(-1)}
            />

            <span>
                {pageRef.current || "?"} / {pageCount || "?"}
            </span>

            <Button
                style={{
                    backgroundColor: ButtonColour.BLUE
                }}
                icon={require("@assets/img/interface/next.svg")}
                onClick={() => switchPage(1)}
            />
        </div>
    </div>;
}

export default ArticleList;