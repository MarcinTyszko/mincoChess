import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

async function verifySession() {
    const verifyResponse = await fetch("/internal/verify");
    
    return await verifyResponse.json();
}

function useProtectedRoute() {
    const navigate = useNavigate();

    const { data: sessionValidity, status, fetchStatus } = useQuery({
        queryKey: ["sessionValidity"],
        queryFn: verifySession,
        retry: true
    });

    useEffect(() => {
        if (status != "success" || fetchStatus != "idle") return;

        if (!sessionValidity) {
            navigate("/internal/login");
        }
    }, [fetchStatus]);
}

export default useProtectedRoute;