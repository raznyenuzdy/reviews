import React from 'react';
import { useRouter } from 'next/router';
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Stack } from '@chakra-ui/react';

// library.add(faCheckSquare, faCoffee);
// dom.watch();

const NavBarItem = ({ children, href, className, icon, tabIndex, testId, mr }) => {
    const router = useRouter();
    const activeClass = 'navbar-item-active';
    const activeClasses = className ? `${className} ${activeClass}` : activeClass;

    return (
        <Stack direction={['row']}>
            {icon && <Box><FontAwesomeIcon icon={icon} size="2xl" /></Box>}
            <Box className={router.asPath === href ? activeClasses : className} tabIndex={tabIndex} data-testid={testId}>
                {children}
            </Box>
        </Stack>
    );
};

export default NavBarItem;
