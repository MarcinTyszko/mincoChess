import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clamp } from "lodash";

import ArticleListing from "@components/common/ArticleListing";
import BlurredNoiseBackground from "@components/common/BlurredNoiseBackground";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import { getNewsArticles, getNewsArticlesPages } from "@lib/newsArticles";

import * as styles from "./ArticleList.module.css";

function News() {
    const { t } = useTranslation();

    const queryClient = useQueryClient();

    const [ searchParams, setSearchParams ] = useSearchParams();

    const pageRef = useRef(
        parseInt(searchParams.get("page") || "1") || 1
    );

    const pageButtonsRef = useRef<HTMLDivElement>(null);

    const { data: newsArticles, status } = useQuery({
        queryKey: ["newsArticles"],
        queryFn: () => getNewsArticles(pageRef.current)
    });

    const { data: pageCount } = useQuery({
        queryKey: ["newsArticlesPages"],
        queryFn: getNewsArticlesPages
    });

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

    useEffect(() => {
        pageButtonsRef.current?.scrollIntoView();
    }, [pageRef.current]);

    return <div className={styles.wrapper}>
        <div className={styles.titleSection}>
            <div className={styles.title}>
                <BlurredNoiseBackground
                    width={400}
                    height={67}
                    density={10}
                    colours={[
                        "var(--ui-blue)",
                        "var(--ui-lavender)"
                    ]}
                />

                <img
                    src={require("@assets/img/news.png")}
                    height={45}
                    style={{ zIndex: 1 }}
                />

                <span style={{
                    fontSize: "2rem",
                    zIndex: 1,
                    overflowWrap: "anywhere"
                }}>
                    {t("pages.news.title")}
                </span>
            </div>

            <div className={styles.titleDescription}>
                Get the latest updates on the WintrChess platform
            </div>
        </div>  

        <div className={styles.articles}>
            {
                status == "success"
                && newsArticles.map(
                    article => <ArticleListing article={article}/>
                )
            }

            {
                status == "error"
                && <span className={styles.error}>
                    {t("pages.news.error")}
                </span>
            }
        </div>

        <div className={styles.pageButtons} ref={pageButtonsRef}>
            <Button
                style={{
                    backgroundColor: ButtonColour.BLUE
                }}
                icon={require("@assets/img/back.svg")}
                onClick={() => switchPage(-1)}
            />

            <span>
                {pageRef.current || "?"} / {pageCount || "?"}
            </span>

            <Button
                style={{
                    backgroundColor: ButtonColour.BLUE
                }}
                icon={require("@assets/img/next.svg")}
                onClick={() => switchPage(1)}
            />
        </div>
    </div>;
}

export default News;