import React from "react";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import ArticleListing from "@components/news/ArticleListing";

import * as styles from "./News.module.css";

function News() {
    return <div className={styles.wrapper}>
        <Button
            icon={require("@assets/img/add.svg")}
            style={{
                backgroundColor: ButtonColour.BLUE
            }}
        >
            Compose News Post
        </Button>

        New
    </div>;
}

export default News;