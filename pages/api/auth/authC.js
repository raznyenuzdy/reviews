// src/auth/auth0-provider-with-history.js

import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const Auth0ProviderWithHistory = ({ children }) => {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}

export default Auth0ProviderWithHistory;