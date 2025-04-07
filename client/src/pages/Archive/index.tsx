import React from "react";
import { Link } from "react-router-dom";

import * as styles from "./Archive.module.css";

function Archive() {
    return <div className={styles.wrapper}>
        <div className={styles.messageContent}>
            <h1>Archive is coming soon</h1>

            <span>
                The archive page is where you will store your analysed
                games, which can be reloaded and edited any time you
                want. This feature is still under construction; you
                can keep yourself up-to-date with the&nbsp;

                <Link to="/news" style={{ color: "var(--ui-blue)" }}>
                    news page!
                </Link>
            </span>
        </div>
    </div>;
}

export default Archive;