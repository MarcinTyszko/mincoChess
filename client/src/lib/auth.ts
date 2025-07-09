import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
    basePath: "/auth",
    plugins: [usernameClient()]
});

export default authClient;