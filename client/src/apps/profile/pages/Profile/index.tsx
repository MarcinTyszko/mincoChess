import React from "react";
import { useQuery } from "@tanstack/react-query";

import { getAccountProfile } from "@lib/api/profile";

function Profile() {
    const username = location.pathname.split("/").at(2) || "";

    const { data: profile, status } = useQuery({
        queryKey: ["profile", username],
        queryFn: () => getAccountProfile(username)
    });

    return <span>
        Yay Profile!

        {status == "success" && profile.displayName}

        {status == "error" && "Failed to get profile"}
    </span>;
}

export default Profile;