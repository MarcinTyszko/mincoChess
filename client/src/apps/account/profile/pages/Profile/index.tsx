import React from "react";
import { useParams } from "react-router-dom";

import { usePublicProfile, useAuthedProfile } from "@/hooks/api/useProfile";
import ProfileCard from "@/apps/account/profile/components/ProfileCard";
import RecentGamesCard from "@/apps/account/profile/components/RecentGamesCard";
import LearningStatsCard from "@/components/learning/LearningStatsCard";
import ExternalAccountsCard from "@/components/chess/ExternalAccountsCard";

import * as styles from "./Profile.module.css";

function Profile() {
    const params = useParams<{ username: string }>();

    const { profile } = usePublicProfile(params.username || "");
    const { profile: authedProfile } = useAuthedProfile();

    const ownProfile = !!authedProfile?.username
        && authedProfile.username == params.username;

    return <div className={styles.wrapper}>
        <ProfileCard profile={profile} />

        {ownProfile && <ExternalAccountsCard/>}

        {ownProfile && <RecentGamesCard/>}

        {ownProfile && <LearningStatsCard/>}
    </div>;
}

export default Profile;
