import { useTranslation } from "react-i18next";

const accountErrorStrings: Record<string, string | undefined> = {
    // Email is not formatted correctly
    INVALID_EMAIL: "pages.signIn.errors.invalidEmail",

    // Account with email doesn't exist or password is incorrect
    INVALID_EMAIL_OR_PASSWORD: "pages.signIn.errors.incorrectEmailPassword",

    // Account exists but can't sign in when email is unverified
    EMAIL_NOT_VERIFIED: "pages.signIn.errors.unverifiedEmail",

    // Account with this email already exists
    USER_ALREADY_EXISTS: "pages.signIn.errors.accountAlreadyExists",

    // Email is unique, but account with username already exists
    USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER: "pages.signIn.errors.accountAlreadyExists",

    // Password validation
    PASSWORD_TOO_SHORT: "pages.signIn.errors.passwordTooShort",
    PASSWORD_TOO_LONG: "pages.signIn.errors.passwordTooLong",

    // Username validation
    USERNAME_IS_TOO_SHORT: "pages.signIn.errors.usernameTooShort",
    USERNAME_IS_TOO_LONG: "pages.signIn.errors.usernameTooLong",
    INVALID_USERNAME: "pages.signIn.errors.usernameAlphanumeric"
};

function useAuthErrors() {
    const { t } = useTranslation();

    return (errorCode?: string) => {
        if (!errorCode) return t("unknownError");

        const errorString = accountErrorStrings[errorCode];
        
        return errorString ? t(errorString) : t("unknownError");
    };
}

export default useAuthErrors;