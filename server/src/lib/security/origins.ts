import dotenv from "dotenv";

dotenv.config();

// The app can be reached on more than one domain (two subdomains pointing
// at the same reverse proxy, say). ORIGIN names the canonical one - it is
// what account emails link to - and ADDITIONAL_ORIGINS lists the rest,
// comma separated.
export const origins = [
    process.env.ORIGIN,
    ...(process.env.ADDITIONAL_ORIGINS ?? "").split(",")
]
    .map(origin => origin?.trim())
    .filter((origin): origin is string => !!origin);

// An origin that does not parse is dropped rather than thrown on, so one
// typo in ADDITIONAL_ORIGINS cannot take the whole deployment offline
export const originHostnames = origins.flatMap(origin => {
    try {
        return [new URL(origin).hostname];
    } catch {
        console.warn(`ignoring malformed origin: ${origin}`);
        return [];
    }
});
