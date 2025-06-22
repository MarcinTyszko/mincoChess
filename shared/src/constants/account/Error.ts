enum AccountError {
    ACCOUNT_NOT_FOUND = "accountNotFound",
    ACCOUNT_ALREADY_EXISTS = "accountAlreadyExists",
    INVALID_EMAIL = "invalidEmail",
    USERNAME_APLHANUMERIC = "usernameAlphanumeric",
    USERNAME_TOO_SHORT = "usernameTooShort",
    USERNAME_TOO_LONG = "usernameTooLong",
    PASSWORD_TOO_SHORT = "passwordTooShort",
    PASSWORD_TOO_LONG = "passwordTooLong",
    PASSWORD_NO_MATCH = "passwordNoMatch",
    INCORRECT_PASSWORD = "incorrectPassword",
    UNKNOWN = "unknown"
}

export default AccountError;