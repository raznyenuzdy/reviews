// src/components/login-button.js

import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

const LoginButton = ({ colorScheme, children, href, className, icon, tabIndex, testId, disabled=false, size='sm' }) => {
    const router = useRouter();
    return (
        <Button
            onClick={() => router.push(href || '/api/auth/login')}
            colorScheme={colorScheme}
            className={className}
            icon={icon}
            size={size}
            tabIndex={tabIndex}
            isDisabled={disabled}
            testid={testId}>
            {children}
        </Button>);
};

export default LoginButton;
