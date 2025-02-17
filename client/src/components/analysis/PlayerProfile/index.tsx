import React from "react";

import PlayerProfileProps from "./PlayerProfileProps";
import * as styles from "./PlayerProfile.module.css";
import { PieceColour } from "wintrchess";

const profileBorderRadius = "7px";

function PlayerProfile({
    profile,
    colour,
    bottom
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
                onError={event => {
                    event.currentTarget.src = require("@assets/img/defaultprofileimage.png");
                }}
            />
        }

        {
            !!profile.title
            && <span className={styles.title}>{profile.title}</span>
        }

        <span className={styles.username}>
            {
                profile.username
                || (
                    colour == PieceColour.WHITE
                        ? "White"
                        : "Black"
                )
            }
        </span>

        {
            !!profile.rating
            && <span className={styles.rating}>
                ({profile.rating})
            </span>
        }
    </div>;
}

export default PlayerProfile;