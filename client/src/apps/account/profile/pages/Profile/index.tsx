import React from "react";
import { useQuery } from "@tanstack/react-query";

import ProfileCard from "@/apps/account/profile/components/ProfileCard";
import { getAccountProfile } from "@/lib/api/profile";

import * as styles from "./Profile.module.css";

function Profile() {
    const username = location.pathname.split("/").at(2) || "";

    const { data: profile } = useQuery({
        queryKey: ["profile", username],
        queryFn: () => getAccountProfile(username),
        refetchOnWindowFocus: false
    });

    return <div className={styles.wrapper}>
        <ProfileCard profile={profile} />
    </div>;
}

export default Profile;