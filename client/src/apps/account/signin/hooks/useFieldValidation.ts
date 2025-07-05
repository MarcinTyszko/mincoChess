import { useTranslation } from "react-i18next";
import { ZodType } from "zod";

import AccountError from "shared/constants/account/Error";
import StatusMessage from "../../../../components/common/LogMessage/StatusMessage";

const accountErrorStrings: Record<string, string | undefined> = {
    [AccountError.ACCOUNT_NOT_FOUND]: "pages.signIn.errors.accountNotFound",
    [AccountError.ACCOUNT_ALREADY_EXISTS]: "pages.signIn.errors.accountAlreadyExists",
    [AccountError.INVALID_EMAIL]: "pages.signIn.errors.invalidEmail",
    [AccountError.USERNAME_APLHANUMERIC]: "pages.signIn.errors.usernameAlphanumeric",
    [AccountError.USERNAME_TOO_SHORT]: "pages.signIn.errors.usernameTooShort",
    [AccountError.USERNAME_TOO_LONG]: "pages.signIn.errors.usernameTooLong",
    [AccountError.PASSWORD_TOO_SHORT]: "pages.signIn.errors.passwordTooShort",
    [AccountError.PASSWORD_TOO_LONG]: "pages.signIn.errors.passwordTooLong",
    [AccountError.PASSWORD_NO_MATCH]: "pages.signIn.errors.passwordNoMatch",
    [AccountError.INCORRECT_PASSWORD]: "pages.signIn.errors.incorrectPassword",
    [AccountError.UNKNOWN]: "pages.signIn.errors.unknown"
};

function useFieldValidation() {
    const { t } = useTranslation();

    function getErrorMessage(error?: AccountError) {
        return error
            ? t(accountErrorStrings[error] || "pages.signIn.errors.unknown")
            : t("pages.signIn.errors.unknown");
    }

    function validateFields(fields: Map<ZodType, any>) {
        for (const [ schema, value ] of fields.entries()) {
            const parse = schema.safeParse(value);

            if (!parse.success) return {
                theme: "error",
                message: getErrorMessage(
                    parse.error.issues.at(0)?.message as AccountError
                )
            } as StatusMessage;
        }
    }

    return { getErrorMessage, validateFields };
}

export default useFieldValidation;