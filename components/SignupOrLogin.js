import {
    Box,
    Button,
    Text,
    Flex,
    Spacer,
    Stack,
} from '@chakra-ui/react';
import {invertColor, key} from "../utils/utils";
import {useMenuContext} from "../context/menu.context";
import LoginButton from "./LoginButton";
import React from "react";

const SignupOrLogin = () => {
    const {adUserForm, setAdUserForm} = useMenuContext();

    console.log("(((((((((", adUserForm);

    return (
        !adUserForm ?
            <Flex direction='row' alignItems='center' m={['3']}>
                <Box>Have something to write?</Box>
                <Spacer/>
                <Button colorScheme='blue' size={['lg', 'md']} fontSize={['xl', 'xl', 'xl', 'xl', 'lg']}
                        onClick={() => setAdUserForm(true)}>Publish your review</Button>
            </Flex> :
            <Box p={2} borderBottomColor={invertColor('gray.300')} bg={invertColor('gray.300')}>
                    <Text>To submit a review, please,</Text>
                <Box pt={2} pb={2}>
                    <LoginButton
                        colorScheme="blue"
                        size='lg'
                        href="/api/auth/signup"
                        className="btn btn-primary btn-block"
                        tabIndex={0}
                        testId="navbar-login-mobile">
                        Log in or Sign up
                    </LoginButton>
                </Box>
                    <Text>You can register using your google account or personal email account.</Text>
                    <Text>
                        To register and use this website cookies must be allowed. We only use strictly necessary cookies
                        and do not allow third party cookies. We do not sell or otherwise transfer your registration
                        information to any other parties.</Text>
                <Flex pt={2} pb={2} justifyContent={'end'}>
                <Button colorScheme='blue' size={['lg', 'md']} fontSize={['xl', 'xl', 'xl', 'xl', 'lg']}
                        onClick={() => setAdUserForm(false)}>Cancel</Button>
                </Flex>
            </Box>
    );
};

export default SignupOrLogin;
