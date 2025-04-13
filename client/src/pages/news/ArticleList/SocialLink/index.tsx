import React from "react";
import { Link } from "react-router-dom";

import SocialLinkProps from "./SocialLinkProps";
import * as styles from "./SocialLink.module.css";

function SocialLink({ icon, username, url }: SocialLinkProps) {
    return <Link
        to={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
    >
        <div className={styles.wrapper}>
            {icon && <img src={icon} />}

            <span className={styles.username}>
                {username}
            </span>
        </div>
    </Link>;
}

export default SocialLink;