import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

async function verifySession() {
    const internalResponse = await fetch("/internal", {
        redirect: "manual"
    });
    
    return internalResponse.ok;
}

function useProtectedRoute() {
    const navigate = useNavigate();

    const { data: sessionValid, status } = useQuery({
        queryKey: ["verifySession"],
        queryFn: verifySession,
        retry: true
    });

    useEffect(() => {
        if (status == "pending") return;

        if (!sessionValid) {
            navigate("/internal/login");
        }
    }, [status]);
}

export default useProtectedRoute;