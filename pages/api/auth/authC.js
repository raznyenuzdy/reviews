// src/auth/auth0-provider-with-history.js

import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
    return (
        <Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
            clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
            cache={false}
            audience={process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}>
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;

/*
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';

const Auth0ProviderWithHistory = ({ children }) => {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}

export default Auth0ProviderWithHistory;*/