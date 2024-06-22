import React from "react";

import PlayerProfileProps from "./PlayerProfileProps";

import * as styles from "./PlayerProfile.module.css";

const profileBorderRadius = "7px";

function PlayerProfile({
    children,
    bottom,
    rating,
    title,
    profileImage
}: PlayerProfileProps) {
    return <div 
        className={styles.wrapper}
        style={
            bottom ?
                {
                    borderBottomLeftRadius: profileBorderRadius,
                    borderBottomRightRadius: profileBorderRadius
                }
                : {
                    borderTopLeftRadius: profileBorderRadius,
                    borderTopRightRadius: profileBorderRadius
                }
        }
    >
        {
            profileImage ?
                <img 
                    className={styles.profileImage} 
                    src={profileImage}
                />
                :
                ""
        }

        {
            title ?
                <span className={styles.title}>{title}</span>
                : ""
        }

        <span className={styles.username}>{children}</span>

        {
            rating ?
                <span className={styles.rating}>({rating})</span>
                : ""
        }
    </div>;
}

export default PlayerProfile;