import {handleAuth, getAccessToken, getSession, handleCallback, handleLogin} from '@auth0/nextjs-auth0';
import Joi from "joi";

const ErrorResponseToaster = (responseData) => {
}

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
        console.log("Outnah", response.status, responseData);
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

const getLoginState = (req, loginOptions) => {
    return { basket_id: getBasketId(req) };
};

export default handleAuth({/*
    callback: async (req, res) => {
        try {
            // let accessToken = null;
            // try {
            //     accessToken = await getAccessToken(req, res);
            // } catch (error) {
            //     console.log('ERROR:auth0:handleAuth1:', error);
            // }
            // await handleCallback(req, res, { afterCallback });
            // try {
            //     const session = getSession(req, res);
            // } catch (error) {
            //     console.log('ERROR:auth0:handleAuth1:', error);
            // }
            // return accessToken ? await handleCallback(req, res, { afterCallback }) :
            // await handleCallback(req, res);
        } catch (error) {
            console.log("ERROR:auth0:handleAuth:catch2:", error);
            res.status(error.status || 500).end();
        }
    },
    login: async (req, res) => {
        try {
            await handleLogin(req, res, {
                // Get the connection name from the Auth0 Dashboard
                authorizationParams: {
                    connection: null, //'github'
                    connection_scope: null,//'openid profile email offline_access', //'public_repo read:user'
                    invitation: "",//
                    screen_hint: "",
                    // scope: 'openid profile email offline_access',
                    // useRefreshTokens: true,
                    // audience: 'http://localhost:3000/'
                },
                //getLoginState,//Generate a unique state value for use during login transactions.
                returnTo: "" //URL to return to after login. Overrides the default in BaseConfig.baseURL.
            });
        } catch (error) {
            console.error(error);
        }
    }*/
})
