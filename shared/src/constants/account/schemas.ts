import z from "zod";

import AccountError from "./AccountError";

export const email = z.string().email(AccountError.INVALID_EMAIL);

export const displayName = z.string()
    .min(3, AccountError.USERNAME_TOO_SHORT)
    .max(24, AccountError.USERNAME_TOO_LONG)
    .regex(/^[\p{L}\p{N} ]+$/u, AccountError.DISPLAY_NAME_NORMALISED);

export const username = z.string()
    .min(3, AccountError.USERNAME_TOO_SHORT)
    .max(20, AccountError.USERNAME_TOO_LONG)
    .regex(/^\w+$/, AccountError.USERNAME_APLHANUMERIC);

export const password = z.string()
    .min(8, AccountError.PASSWORD_TOO_SHORT)
    .max(128, AccountError.PASSWORD_TOO_LONG);

export const registration = z.object({
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