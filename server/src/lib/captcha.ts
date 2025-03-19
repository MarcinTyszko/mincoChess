export async function verifyCaptchaToken(token: string, secret?: string) {
    if (!secret) return true;

    const captchaResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                secret: secret,
                response: token
            })
        }
    );

    const captchaResult = await captchaResponse.json();
        
    return Boolean(captchaResult.success);
}