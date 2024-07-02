import React from "react";

import PlayerProfileProps from "./PlayerProfileProps";
import * as styles from "./PlayerProfile.module.css";

const profileBorderRadius = "7px";

function PlayerProfile({
    bottom,
    profile
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
            !!profile.image
            && <img 
                className={styles.profileImage} 
                src={profile.image}
            />
        }

        {
            !!profile.title
            && <span className={styles.title}>{profile.title}</span>
        }

        <span className={styles.username}>{profile.username}</span>

        {
            !!profile.rating
            && <span className={styles.rating}>({profile.rating})</span>
        }
    </div>;
}

export default PlayerProfile;