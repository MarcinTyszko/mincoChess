import React from "react";
import { useQuery } from "@tanstack/react-query";

import SkeletonProfileCard from "@apps/profile/components/SkeletonProfileCard";
import ProfileCard from "@apps/profile/components/ProfileCard";
import { getAccountProfile } from "@lib/api/profile";

import * as styles from "./Profile.module.css";

function Profile() {
    const username = location.pathname.split("/").at(2) || "";

    const { data: profile, status } = useQuery({
        queryKey: ["profile", username],
        queryFn: () => getAccountProfile(username),
        refetchOnWindowFocus: false
    });

    return <div className={styles.wrapper}>
        {status == "success"
            ? <ProfileCard profile={profile} />
            : <SkeletonProfileCard/>    
        }
    </div>;
}

export default Profile;