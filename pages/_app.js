import React from 'react';
import {ChakraProvider, localStorageManager} from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import initFontAwesome from '../utils/initFontAwesome';
import Auth0ProviderWithHistory from './api/auth/authC';
import SignInPrompt from '../components/dialogs/SignInPrompt';
import ErrorMessage from '../components/ErrorMessage';
import {ColorModeSwitcher} from "../components/colorModelSwitcher";
import {themeConfig, buttonTheme, checkboxTheme} from "../startup/theming";

import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
import {invertColor} from "../utils/utils";

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(inputAnatomy.keys)

const pill = definePartsStyle({
    field: {
        border: '1px solid',
        borderColor: invertColor('gray.200'),
        background: invertColor('gray.850'),
        borderRadius: 'full',

        // Let's also provide dark mode alternatives
        _dark: {
            // borderColor: 'gray.600',
            // background: 'gray.800',
        },
    },
    addon: {
        border: '1px solid',
        borderColor: 'gray.200',
        background: 'gray.200',
        borderRadius: 'full',
        color: 'gray.500',

        _dark: {
            borderColor: 'gray.600',
            background: 'gray.600',
            color: 'gray.400',
        },
    },
})

export const inputTheme = defineMultiStyleConfig({
    variants: { pill },
})


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
        Input: inputTheme
    } });

export default function App({ Component, pageProps }) {
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
