import z from "zod";

export const linkedAccountsSchema = z.object({
    chessCom: z.string().trim().max(50).optional(),
    lichess: z.string().trim().max(50).optional()
});

export type LinkedAccounts = z.infer<typeof linkedAccountsSchema>;

export default LinkedAccounts;
