import { Session, User } from "better-auth";

declare global {
    declare namespace Express {
        interface Request {
            session?: Session;
            user?: User;
            
            accountId?: string;
            accountIdToken?: string;
        }
    }
}