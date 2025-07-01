import z from "zod";

export const fieldSchema = z.enum([
    "displayName",
    "username",
    "emailAddress",
    "password"
]);

export type AccountField = z.infer<typeof fieldSchema>;