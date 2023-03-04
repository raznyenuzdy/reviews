import React, { useEffect } from 'react';
import CentralFooter from './CentralFooter';
import { Container } from '@chakra-ui/react';
import NavBar from './NavBar';
import Error from './Error';
import { useUser } from '@auth0/nextjs-auth0/client';
import { maxWidthLayout, paddingLayout } from '../startup/theming';
import { useRouter } from 'next/router';

function Layout({ children, logout }) {

    const router = useRouter();

    const { user } = useUser();

    useEffect(() => {
        if (user && logout) logOut();
    })

    const logOut = () => {
        router.push('/api/auth/logout');
    }

    return (
        <>
            <Error />
            <NavBar />
            <Container w='100%' maxW={maxWidthLayout} p={paddingLayout} >
                {children}
            </Container>
            <CentralFooter />
        </>)
};

export default Layout;
