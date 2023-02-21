import React from 'react';
import {ChakraProvider, ColorModeScript, localStorageManager, useColorMode} from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import initFontAwesome from '../utils/initFontAwesome';
import Auth0ProviderWithHistory from './api/auth/authC';
import SignInPrompt from '../components/dialogs/SignInPrompt';
import ErrorMessage from '../components/ErrorMessage';
import {ColorModeSwitcher} from "../components/colorModelSwitcher";
import {themeConfig, buttonTheme, checkboxTheme} from "../startup/theming";
// import { UserProvider } from '@auth0/nextjs-auth0/client';

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

const theme = extendTheme({ colors, breakpoints, fontSize, config: themeConfig,
    components: {
        Button: buttonTheme,
        Checkbox: checkboxTheme,
    } });

export default function App({ Component, pageProps }) {
    let { colorMode, toggleColorMode } = useColorMode();
    console.log("CCCCC11", colorMode);

    return (
        <Auth0ProviderWithHistory>
            <ChakraProvider
                colorModeManager={localStorageManager}
                theme={theme}>
                <ColorModeSwitcher />
                <SignInPrompt />
                <ErrorMessage />
                <Component {...pageProps} />
            </ChakraProvider>
        </Auth0ProviderWithHistory>
    );
}
