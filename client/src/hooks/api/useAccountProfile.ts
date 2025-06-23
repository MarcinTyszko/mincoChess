import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAuthenticatedAccountProfile } from "@lib/api/profile";

type PageShowListener = Parameters<typeof addEventListener<"pageshow">>[1];

function useAccountProfile() {
    const { data: profile, status, refetch } = useQuery({
        queryKey: ["profile"],
        queryFn: getAuthenticatedAccountProfile,
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

    if (status == "success") return {
        profile: profile!, status
    };

    return { profile, status };
}

export default useAccountProfile;