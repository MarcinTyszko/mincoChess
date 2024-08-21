import React from "react";

import { formatDate } from "@lib/utils/date";

import ArticleListingProps from "./ArticleListingProps";
import * as styles from "./ArticleListing.module.css";

function ArticleListing({ article }: ArticleListingProps) {
    return <div className={styles.wrapper}>
        <div className={styles.metadata}>
            <span
                className={styles.category}
                style={{
                    backgroundColor: article.tag.colour && `${article.tag.colour}4c`,
                    borderColor: `${article.tag.colour}ab`
                }}    
            >
                {article.tag.name}
            </span>

            <span className={styles.date}>
                {formatDate(new Date(article.date))}
            </span>
        </div>

        {article.title}
    </div>;
}

export default ArticleListing;