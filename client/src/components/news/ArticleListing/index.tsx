import React from "react";

import ArticleListingProps from "./ArticleListingProps";
import * as styles from "./ArticleListing.module.css";

function ArticleListing({
    children,
    category,
    categoryColour,
    date
}: ArticleListingProps) {
    return <div className={styles.wrapper}>
        <div className={styles.metadata}>
            <span
                className={styles.category}
                style={{
                    backgroundColor: categoryColour && `${categoryColour}4c`,
                    borderColor: `${categoryColour}ab`
                }}    
            >
                {category}
            </span>

            <span className={styles.date}>
                {date.toDateString()}
            </span>
        </div>

        {children}
    </div>;
}

export default ArticleListing;