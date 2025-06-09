import { OAuth2Client } from "google-auth-library";

export function getGoogleOAuth() {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    
    return {
        clientId,
        clientSecret,
        client: new OAuth2Client(
            clientId, clientSecret, "postmessage"
        )
    };
}