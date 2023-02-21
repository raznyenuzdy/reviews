import {
    Box, Button, Flex, Avatar, HStack, Tooltip, Menu, MenuButton,
    MenuList, MenuItem, SkeletonCircle, Link, useDisclosure,
    useColorModeValue, Stack,
} from '@chakra-ui/react';
import * as NextLink from 'next/link'
import React, { useState, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import AnchorLink from './AnchorLink';
import { useGrantsContext } from "../context/auth.context";
import LoginButton from './LoginButton';
import DashboardAdmin from './DashboardAdmin';
import { avatarNavBarSize, notApprovedColor } from '../startup/theming';
import { nameString } from '../utils/utils';
const Links = [];//['Dashboard', 'Projects', 'Team'];

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

    const { grants } = useGrantsContext();

    console.log("GRAGRA", grants);

    const [isOpened, setIsOpened] = useState(false);

    const { user, error, isLoading } = useUser();

    const userName = nameString(grants?.user_model, grants);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const btnRef = React.useRef();

    const toggle = () => setIsOpened(!isOpen);
    return (
        <Flex w='100%'
            bg={useColorModeValue('gray.100', 'gray.900')} px={[1, 2, 4]}>
            <Flex
                w='100%'
                justifyContent={'space-between'}
                fontSize={['lg', 'lg', 'lg', 'xl', '2xl']}
                h={'16'}
            >
                <DashboardAdmin />
                <HStack spacing={8} alignItems={'center'}>
                    <AnchorLink
                        href="/"
                        className="btn btn-link p-0"
                        testId="navbar-logout-mobile">
                        Home
                    </AnchorLink>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}>
                        {Links.map((link) => (
                            <NavLink key={link}>{link}</NavLink>
                        ))}
                    </HStack>
                </HStack>
                {user ?
                    <Flex alignItems={'center'}>
                        <Menu>
                            <Tooltip label={userName} bg={notApprovedColor}>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'md'}
                                        name={'userName'}
                                        src={user?.picture}
                                    />
                                </MenuButton>
                            </Tooltip>
                            <MenuList>
                                <MenuItem>
                                    <Tooltip label={userName} bg={notApprovedColor}>
                                        <Avatar
                                            size={avatarNavBarSize}
                                            src={user?.picture}
                                            mr="12px"
                                        />
                                    </Tooltip>
                                    <AnchorLink
                                        href="/profile"
                                        className="btn btn-link p-0"
                                        testId="navbar-logout-mobile">
                                        {user?.name}
                                    </AnchorLink>
                                </MenuItem>
                                <MenuItem>
                                    <AnchorLink
                                        href="/api/auth/logout"
                                        className="btn btn-link p-0"
                                        testId="navbar-logout-mobile">
                                        Log out
                                    </AnchorLink>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex> :
                    <Flex alignItems={'center'}>
                        {isLoading ?
                            <SkeletonCircle size='1' /> :
                            <LoginButton
                                colorScheme="blue"
                                size='lg'
                                href="/api/auth/login"
                                className="btn btn-primary btn-block"
                                tabIndex={0}
                                testId="navbar-login-mobile">
                                Log in
                            </LoginButton>}
                    </Flex>}
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
