import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAuthenticatedUserProfile } from "@/lib/api/profile";

type PageShowListener = Parameters<typeof addEventListener<"pageshow">>[1];

function useAccountProfile() {
    const { data: profile, status, refetch } = useQuery({
        queryKey: ["profile"],
        queryFn: getAuthenticatedUserProfile,
        refetchOnWindowFocus: false,
        retry: false
    });

    useEffect(() => {
        const refetchPersisted: PageShowListener = event => {
            if (event.persisted) refetch();
        };

        addEventListener("pageshow", refetchPersisted);

        return () => removeEventListener("pageshow", refetchPersisted);
    }, []);

    return status == "success"
        ? { profile: profile!, status, refetch }
        : { profile, status, refetch };
}

export default useAccountProfile;