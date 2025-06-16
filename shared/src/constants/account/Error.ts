enum AccountError {
    ACCOUNT_NOT_FOUND = "accountNotFound",
    ACCOUNT_ALREADY_EXISTS = "accountAlreadyExists",
    INVALID_EMAIL = "invalidEmail",
    USERNAME_TOO_SHORT = "usernameTooShort",
    USERNAME_TOO_LONG = "usernameTooLong",
    PASSWORD_TOO_SHORT = "passwordTooShort",
    PASSWORD_TOO_LONG = "passwordTooLong",
    INCORRECT_PASSWORD = "incorrectPassword",
    UNKNOWN = "unknown"
}

export default AccountError;