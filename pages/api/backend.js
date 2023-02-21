import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function backend(req, res) {
    try {
        if (!req.headers?.url) {
            res.status(500).json({status:500, message: "Bad request data"});
        }
        const { accessToken } = await getAccessToken(req, res);
        if (!accessToken) {
            res.status(401).json({status:401, message: "Request not authorized."});
        }
        const options = {
            method: `${req.method || 'GET'}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': `${req.headers['Content-type'] || 'application/json'}`,
            }
        };
        if (req.headers?.key) options.headers.key = req.headers?.key;
        if (req.body) options.body = req.body;
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}${req.headers.url}`,
            options
        );
        const responseData = await response.json();
        const resp = (({ ok, redirected, status, statusText }) => ({ ok, redirected, status, statusText }))(response);
        resp.responseData = responseData;
        res.json(resp);
    } catch (error) {
        console.log("ERROR:backend:withApiAuthRequired:catch:", error.code);
        if (error.code === 'ERR_EXPIRED_ACCESS_TOKEN') {
            return res.redirect('/api/auth/logout');
        }
        // res.writeHead(301, {
        //     Location: '/api/auth/logout'
        //   });
          res.end();
        // res.redirect('/api/auth/logout');
        // if (error.code === 'access_token_expired') {
            // await fetch('logout', {method: 'GET'});
        // }
        // res.status(500).json(error);
    }
})
