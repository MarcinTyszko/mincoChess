import React from "react";

import CreditsProfileProps from "./CreditsProfileProps";
import * as styles from "./CreditsProfile.module.css";

function CreditsProfile({
    username,
    subheader,
    profileImage,
    connections
}: CreditsProfileProps) {
    return <div className={styles.profile}>
        <img 
            className={styles.image}
            src={profileImage} 
        />

        <div className={styles.profileInfo}>
            <div className={styles.profileText}>
                <span style={{ fontSize: "1.2rem" }}>
                    {username}
                </span>

                <span className={styles.subheader}>
                    {subheader}
                </span>
            </div>
            
            <div className={styles.connections}>
                {connections.map(connection => <a href={connection.url}>
                    <img
                        className={styles.connectionIcon}
                        src={connection.icon as any}
                        width={35}
                    />
                </a>)}
            </div>
        </div>
    </div>;
}

export default CreditsProfile;