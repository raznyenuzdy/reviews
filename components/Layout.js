import React from 'react';
import Central from './Central';
import CentralFooter from './CentralFooter';
import { Container, useToast } from '@chakra-ui/react';
import NavBar from './NavBar';
import Error from './Error';
import {maxWidthLayout, paddingLayout} from '../startup/theming';
import inAppEvent from '../startup/events';

function Layout({ children }) {

    // const toast = useToast();

    // const handleError = (error) => {
    //     const status = error.status || error.statusCode || '';
    //     const title = error.statusText || 'Error';
    //     const description = typeof error === 'string' ? error : error.message || dafaultError;
    //     console.log("TOASTER:", error, {
    //         title,
    //         description,
    //         status,
    //         duration: 9000,
    //         isClosable: true,
    //       });
    //     toast({
    //         title,
    //         description,
    //         status,
    //         duration: 9000,
    //         isClosable: true,
    //       })
    // }

    // inAppEvent.clear('errorEvent');
    // inAppEvent.on('errorEvent', handleError);

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
