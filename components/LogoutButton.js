// src/components/login-button.js

import React from 'react';
import { Button } from '@chakra-ui/react';

const LogoutButton = ({ colorScheme, children, href, className, icon, tabIndex, testId }) => {

    return (
    <Button
        onClick={() => logOff()}
        colorScheme={colorScheme}
        className={className}
        icon={icon}
        tabIndex={tabIndex}
        testid={testId}>
        {children}
    </Button>);
};

export default LogoutButton;
