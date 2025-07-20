import React from "react";

import * as styles from "./Archive.module.css";

import iconLogo from "@assets/img/logo.svg";

function Archive() {
    return <div className={styles.wrapper}>
        <div className={styles.messageContent}>
            <img
                src={iconLogo}
                height={70}
                draggable={false}
            />

            <h1 style={{ margin: 0 }}>
                Archive is coming soon
            </h1>

            <span>
                The archive page is where you will store your analysed
                games, which can be reloaded and edited any time you
                want. This feature is still under construction; you
                can keep yourself up-to-date with the{" "}

                <a href="/news" style={{ color: "var(--ui-blue)" }}>
                    news page!
                </a>
            </span>
        </div>
    </div>;
}

export default Archive;