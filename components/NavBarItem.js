import React from 'react';
import { useRouter } from 'next/router';
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SettingsIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { Box, Stack } from '@chakra-ui/react';
import { navbarFontSize } from '../startup/theming';
// library.add(faCheckSquare, faCoffee);
// dom.watch();

const NavBarItem = ({ children, href, className, icon, tabIndex, testId, mr }) => {
    const router = useRouter();
    const activeClass = 'navbar-item-active';
    const activeClasses = className ? `${className} ${activeClass}` : activeClass;

    return (
        <Stack direction={['row']} alignItems="center">
            {icon && <SettingsIcon mt='2px' boxSize={8} color='green.600' />}
            <Box
            className={router.asPath === href ? activeClasses : className}
            tabIndex={tabIndex}
            fontSize={navbarFontSize}
            data-testid={testId}>
                {children}
            </Box>
        </Stack>
    );
};

export default NavBarItem;
