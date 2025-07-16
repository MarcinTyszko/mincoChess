import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import accountErrors from "shared/constants/account/errors";
import useAuthErrors from "@/hooks/auth/useAuthErrors";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";

function useAuthErrorReporter(
    onStatusMessage: (statusMessage: StatusMessage) => void
) {
    const [ searchParams ] = useSearchParams();

    const getErrorMessage = useAuthErrors();

    useEffect(() => {
        // Attempting to login to social when email already exists
        if (searchParams.get("error") != "account_not_linked") return;

        onStatusMessage({
            theme: "error",
            message: getErrorMessage(accountErrors.EMAIL_TAKEN.code)
        });
    }, []);
}

export default useAuthErrorReporter;