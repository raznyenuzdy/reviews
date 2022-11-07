// src/components/login-button.js

import React from 'react';
import { Button } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = ({ colorScheme, children, className, icon, tabIndex, testId, disabled=false, size='sm' }) => {
    const { loginWithPopup } = useAuth0();
    return (
        <Button
            onClick={loginWithPopup}
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
