import {
    Box, Button, Flex, Avatar, HStack, Link, Switch, FormControl,
    FormLabel, IconButton, Menu, MenuButton, MenuList, MenuItem,
    Skeleton, SkeletonCircle, SkeletonText, Text,
    MenuDivider, useDisclosure, useColorModeValue, Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
const Links = [];//['Dashboard', 'Projects', 'Team'];
import React, { useState, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useAuth0 } from "@auth0/auth0-react";
import AnchorLink from './AnchorLink';
import AnchorLogoutButton from './AnchorButton';
import ButtonLink from './ButtonLink';
import { useGrantsContext } from "../context/auth.context";
import MenuLink from "./MenuLink";
import LoginButton from './LoginButton';
import DashboardAdmin from './DashboardAdmin';

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
    </Link>
);

const NavBar = () => {
    const { isAuthenticated, user, isLoading, error } = useAuth0();
    const [isOpened, setIsOpened] = useState(false);
    // const { user, error, isLoading } = useUser();
    const { grants, grantsLoading } = useGrantsContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    const toggle = () => setIsOpened(!isOpen);
    return (
        <Flex w='100%'
        bg={useColorModeValue('gray.100', 'gray.900')} px={[1,2,4]}>
            <Flex 
            w='100%'
            justifyContent={'space-between'}
            fontSize={['lg','lg','lg','xl','2xl']}
            h={'16'}
            >
                <DashboardAdmin />
                <HStack spacing={8} alignItems={'center'}>
                    <Text>Logo</Text>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}>
                        {Links.map((link) => (
                            <NavLink key={link}>{link}</NavLink>
                        ))}
                    </HStack>
                </HStack>
                {(isAuthenticated && grants && !grantsLoading) ?
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar
                                    size={'md'}
                                    src={grants.picture}
                                />
                            </MenuButton>
                            <MenuList>
                                <MenuItem>
                                    <Avatar
                                        size={'sm'}
                                        src={grants.picture}
                                        mr="12px"
                                    />
                                    <AnchorLink
                                        href="/api/auth/logout"
                                        className="btn btn-link p-0"
                                        testId="navbar-logout-mobile">
                                        {grants.name}
                                    </AnchorLink>
                                </MenuItem>
                                <MenuItem>
                                    <AnchorLogoutButton
                                        href="/api/auth/logout"
                                        className="btn btn-link p-0"
                                        icon="power-off"
                                        mr="12px"
                                        testId="navbar-logout-mobile">
                                        Log out
                                    </AnchorLogoutButton>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex> : null
                }
                {((!isAuthenticated && isLoading) || !user) ?
                    <Flex alignItems={'center'}>
                        <LoginButton
                            colorScheme="blue"
                            size='lg'
                            href="/api/auth/login"
                            className="btn btn-primary btn-block"
                            disabled={grantsLoading}
                            tabIndex={0}
                            testId="navbar-login-mobile">
                            Log in
                        </LoginButton>
                    </Flex> : null
                }
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        {Links.map((link) => (
                            <NavLink key={link}>{link}</NavLink>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Flex>
    );
};

export default NavBar;
