import {getAccessToken, getSession} from '@auth0/nextjs-auth0';

//если авторизован, просто прокинуть данные сессии, если не авторизован, ненадо
export default async function backend(req, res) {
    try {
        if (!req.headers?.url) {
            return res.status(500).json({status: 500, message: "Bad request data"});
        }
        let accessToken = null;
        let session = null;
        try {
            accessToken = await getAccessToken(req, res);
            console.log("AT:", accessToken);
            if (accessToken) {
                session = await getSession(req, {});
            }
        } catch (error) {
            console.log('ERROR:index:getServerSideProps:catch:', error);
        }

        const options = {
            method: `${req.method || 'GET'}`,
            headers: {
                'Content-type': `${req.headers['Content-type'] || 'application/json'}`,
            }
        };
        if (session?.accessToken) options.headers['Authorization'] = `Bearer ${session?.accessToken}`;
        if (session?.idToken) options.headers['idToken'] = session?.idToken;
        if (req.headers?.key) options.headers.key = req.headers?.key;
        if (Object.keys(req.body).length > 0) options.body = req.body;
        console.log("OPTIONS:", options);
        // const options = httpHeaderPrepare(accessToken);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}${req.headers.url}`,
            options
        );
        const responseData = await response.json();
        const resp = (({ok, redirected, status, statusText}) => ({ok, redirected, status, statusText}))(response);
        resp.responseData = responseData;
        res.json(resp);
    } catch (error) {
        console.log("ERROR:backend:catch:", error);
        // res.end();
    }
}
