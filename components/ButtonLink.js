import React from 'react';
import {Button} from '@chakra-ui/react';

const ButtonLink = ({ colorScheme, children, href, className, icon, tabIndex, testId }) => (
        <a href={href}>
            <Button colorScheme={colorScheme} className={className} icon={icon} tabIndex={tabIndex} testid={testId}>
                {children}
            </Button>
        </a>
    );

export default ButtonLink;
