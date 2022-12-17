import React from 'react';
import TimeLine from '../components/TimeLine';
import { getBlocks } from '../db/model2';
import { Box, Flex, Center, ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/Layout';
import { extendTheme } from '@chakra-ui/react'
import initFontAwesome from '../utils/initFontAwesome';
import { GrantsContextProvider } from '../context/auth.context';
import { ModelContextProvider } from '../context/model.context';
import { MenuContextProvider } from '../context/menu.context';
import Auth0ProviderWithHistory from './api/auth/authC';
import SignInPrompt from '../components/dialogs/SignInPrompt';

export async function getServerSideProps(context) {
    const model = await getBlocks(0);
    return {
        props: {model}, // will be passed to the page component as props
    }
}

// 2. Update the breakpoints as key-value pairs
const breakpoints = {
    '2xs': '320px',
    'xs': '375px',
    'sm': '425px',
    'md': '768px',
    'lg': '960px',
    'xl': '1200px',
    '2xl': '1536px',
}

const fontSize = {
    '2xs': '1em',
    'xs': '1em',
    'sm': '1em',
    'md': '1em',
    'lg': '1em',
    'xl': '1em',
    '2xl': '1em',
}

const colors = {
    brand: {
        900: '#1a365d',
        800: '#153e75',
        700: '#2a69ac',
    },
}

initFontAwesome();

const theme = extendTheme({ colors, breakpoints, fontSize });

// import { UserProvider } from '@auth0/nextjs-auth0';

export default function Index({model}) {
    return (
        <Auth0ProviderWithHistory>
            {/* <UserProvider> */}
            <GrantsContextProvider>
                <ModelContextProvider _model={model}>
                    <MenuContextProvider>
                        <ChakraProvider theme={theme}>
                            <SignInPrompt/>
                            <Layout>
                            <TimeLine />
                            </Layout>
                        </ChakraProvider>
                    </MenuContextProvider>
                </ModelContextProvider>
            </GrantsContextProvider>
            {/* </UserProvider> */}
        </Auth0ProviderWithHistory>
    );
}
