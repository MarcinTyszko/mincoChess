import React from "react";

import ProfileCardProps from "./ProfileCardProps";
import * as styles from "./ProfileCard.module.css";
import { formatDate } from "shared/lib/date";

function ProfileCard({ profile }: ProfileCardProps) {
    return <div className={styles.wrapper}>
        <div className={styles.avatar}>
            AVATAR
        </div>

        <div className={styles.details}>
            <span className={styles.displayName}>
                {profile.displayName}

                {profile.roles.map(role => <span>
                    {role}
                </span>)}
            </span>

            <span className={styles.username}>
                {profile.username}
            </span>

            <span>
                Member since{" "}
                {formatDate(new Date(profile.createdAt))}
            </span>
        </div>
    </div>;
}

export default ProfileCard;