import { handleAuth, handleLogin, handleProfile, handleCallback } from '@auth0/nextjs-auth0';
import Joi from "joi";

const AuthRole = async (session) => {
    try {
        if (!session) {
            ErrorResponseToaster({message: ['Authorization problem']});
            return;
        }
        const schema = Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            name: Joi.string().required(),
            role: Joi.string()
        });
        const body = { email: session.user.email, name: session.user.name, role: session.user.role };
        const { error } = schema.validate(body);
        if (error) {
            ErrorResponseToaster({ message: [error] });
            return;
        }
        const options = {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-type': 'application/json',
                'idToken': session.idToken
            },
            credentials: 'include',//"same-origin",
            method: 'GET',
        }
        if (session && !!session.user.role) {
            return;
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/user/${session.user.sub}`,
            options
        );
        const responseData = await response.json();
        switch (response.status) {
            case 200:
                session.user.first_name ||= responseData.first_name || session.user.given_name;
                session.user.last_name ||= responseData.last_name || session.user.family_name;
                session.user.hash = responseData.hash ? responseData.hash : null;
                session.user.role = responseData.role ? responseData.role : null;
                session.user.id = responseData.id;
                break;
            case 400:
                ErrorResponseToaster(responseData);
                break;
            case 401:
                ErrorResponseToaster(responseData);
                break;
            case 404:
                ErrorResponseToaster(responseData);
                break;
            case 500:
                ErrorResponseToaster(responseData);
                break;
            default:
                break;
        }
    } catch (error) {
        ErrorResponseToaster({message: [error.message]});
    }
}

const afterCallback = async (req, res, session, state) => {
    await AuthRole(session);
    return new Promise((resolve) => resolve(session));
}

const afterRefetch = async (req, res, session) => {
    return new Promise((resolve) => resolve(session));
}

export default handleAuth({
    callback: async (req, res) => {
        try {
            await handleCallback(req, res, { afterCallback });
        } catch (error) {
            res.status(error.status || 500).end();
        }
    },
    profile: async (req, res) => {
        try {
            await handleProfile(req, res, { afterRefetch, refetch: true });
        } catch (error) {
            console.error(error);
        }
    },
    login: async (req, res) => {
        try {
            await handleLogin(req, res, {
                // Get the connection name from the Auth0 Dashboard
                authorizationParams: { scope: 'openid profile email', audience: 'http://localhost:3000/'}
            });
        } catch (error) {
            console.error(error);
        }
    }
})
