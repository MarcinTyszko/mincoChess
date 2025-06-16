import { useTranslation } from "react-i18next";

import { AccountError } from "wintrchess";

const accountErrorStrings: Record<AccountError, string> = {
    [AccountError.ACCOUNT_NOT_FOUND]: "pages.signIn.errors.accountNotFound",
    [AccountError.ACCOUNT_ALREADY_EXISTS]: "pages.signIn.errors.accountAlreadyExists",
    [AccountError.INVALID_EMAIL]: "pages.signIn.errors.invalidEmail",
    [AccountError.USERNAME_TOO_SHORT]: "pages.signIn.errors.usernameTooShort",
    [AccountError.USERNAME_TOO_LONG]: "pages.signIn.errors.usernameTooLong",
    [AccountError.PASSWORD_TOO_SHORT]: "pages.signIn.errors.passwordTooShort",
    [AccountError.PASSWORD_TOO_LONG]: "pages.signIn.errors.passwordTooLong",
    [AccountError.INCORRECT_PASSWORD]: "pages.signIn.errors.incorrectPassword",
    [AccountError.UNKNOWN]: "pages.signIn.errors.unknown"
};

function useAccountErrors() {
    const { t } = useTranslation();

    return (error: AccountError) => {
        return t(accountErrorStrings[error] || "pages.signIn.errors.unknown");
    };
}

export default useAccountErrors;