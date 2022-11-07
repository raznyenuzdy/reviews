// src/auth/auth0-provider-with-history.js
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
    const domain = 'dev-cp2jcp8t.us.auth0.com'; //process.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = 'HYJrncgiRYTqHmpwn2o61RcnZdBhBQCQ';//process.env.REACT_APP_AUTH0_CLIENT_ID;
    const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

    return ( 
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            cache={false}
            audience={'https://express.sample'}>
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;
