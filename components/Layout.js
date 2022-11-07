import React from 'react';
import Central from './Central';
import CentralFooter from './CentralFooter';
import { Container, Flex, FormControl, Skeleton, SkeletonCircle, SkeletonText, Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';
import NavBar from './NavBar';

function Layout({ children }) {
    return (
        <>
            <NavBar />
            <Container w='100%' maxW={['xs','sm','md','lg','xl','2xl']} p={[0,0,0,2,4,4]} >
                {children}
            </Container>
            <CentralFooter />
        </>)
};

export default Layout;
