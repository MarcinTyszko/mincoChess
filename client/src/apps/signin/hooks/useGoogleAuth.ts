import { useGoogleLogin } from "@react-oauth/google";
import { StatusCodes } from "http-status-codes";

import { AccountError } from "wintrchess";
import StatusMessage from "../types/StatusMessage";
import useAccountErrors from "./useAccountErrors";

function useGoogleAuth(
    redirectUrl: string,
    onError?: (status: StatusMessage) => void
) {
    const getErrorMessage = useAccountErrors();

    const googleLogin = useGoogleLogin({
        onSuccess: async credentials => {
            const googleResponse = await fetch("/auth/google", {
                method: "POST",
                body: credentials.code
            });

            if (googleResponse.status == StatusCodes.CONFLICT) {
                return onError?.({
                    theme: "error",
                    message: getErrorMessage(AccountError.ACCOUNT_ALREADY_EXISTS)
                });
            } else if (googleResponse.status != StatusCodes.OK) {
                return onError?.({
                    theme: "error",
                    message: getErrorMessage(AccountError.UNKNOWN)
                });
            }

            location.href = redirectUrl;
        },
        onError: () => onError?.({
            theme: "error",
            message: getErrorMessage(AccountError.UNKNOWN)
        }),
        flow: "auth-code"
    });

    return googleLogin;
}

export default useGoogleAuth;