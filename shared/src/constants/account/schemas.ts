import z from "zod";

import AccountError from "./Error";

const email = z.string().email(AccountError.INVALID_EMAIL);

const displayName = z.string()
    .min(3, AccountError.USERNAME_TOO_SHORT)
    .max(24, AccountError.USERNAME_TOO_LONG)
    .regex(/^[\p{L}\p{N} ]+$/u, AccountError.DISPLAY_NAME_NORMALISED);

const username = z.string()
    .min(3, AccountError.USERNAME_TOO_SHORT)
    .max(18, AccountError.USERNAME_TOO_LONG)
    .regex(/^\w+$/, AccountError.USERNAME_APLHANUMERIC);

const password = z.string()
    .min(8, AccountError.PASSWORD_TOO_SHORT)
    .max(128, AccountError.PASSWORD_TOO_LONG);

const registration = z.object({
    email,
    username,
    password,
    confirmedPassword: password
}).refine(
    schema => schema.confirmedPassword == schema.password,
    AccountError.PASSWORD_NO_MATCH
);

export default {
    email,
    displayName,
    username,
    password,
    registration
};