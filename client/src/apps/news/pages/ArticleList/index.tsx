import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clamp } from "lodash";

import Loader from "@components/common/Loader";
import Separator from "@components/common/Separator";
import Button from "@components/common/Button";
import ButtonColour from "@components/common/Button/Colour";
import LogMessage from "@components/common/LogMessage";
import Advertisement from "@components/Advertisement";
import BlurredNoiseBackground from "@components/common/BlurredNoiseBackground";
import SocialLink from "@apps/news/components/SocialLink";
import ArticleListing from "@apps/news/components/ArticleListing";
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
        queryFn: () => getNewsArticles(pageRef.current),
        refetchOnWindowFocus: false
    });

    const { data: pageCount } = useQuery({
        queryKey: ["newsArticlesPages"],
        queryFn: getNewsArticlesPages,
        refetchOnWindowFocus: false
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
                    src={require("@assets/img/icons/news.png")}
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
                {t("pages.news.titleDescription")}
            </div>
        </div>

        <div className={styles.socialsSection}>
            <h2 style={{ margin: 0 }}>
                Socials
            </h2>

            <div className={styles.socialsContainer}>
                <SocialLink
                    icon={require("@assets/img/credits/connections/youtube.png")}
                    title="WINTR"
                    url="https://www.youtube.com/@wintrchess"
                />

                <SocialLink
                    icon={require("@assets/img/credits/connections/youtube.png")}
                    title="wintrcat"
                    url="https://www.youtube.com/@wintrcat"
                />

                <SocialLink
                    icon={require("@assets/img/credits/connections/chesscom.png")}
                    iconSize="23px"
                    title="WintrChess Club"
                    url="https://www.chess.com/club/wintrchess/join"
                />
            </div>
        </div>

        <Separator/>

        <Advertisement adUnitId="3904113611" style={{
            width: "100%", height: "100px"
        }}/>

        <div className={styles.articles}>
            {status == "pending"
                && <Loader style={{ margin: "20px 0" }} />
            }

            {status == "success"
                && newsArticles.map(
                    article => <ArticleListing article={article}/>
                )
            }

            {status == "error" && <LogMessage>
                {t("pages.news.error")}
            </LogMessage>}
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

export default News;