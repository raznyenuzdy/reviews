import { handleAuth, handleLogin, handleProfile, handleCallback } from '@auth0/nextjs-auth0';

export default async function signup(req, res) {
    try {
        await handleLogin(req, res, {
            authorizationParams: {
                // connection: "google",
                screen_hint: 'signup',    // this prompts the signup screen
            },
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).end(error.message);
    }
}
