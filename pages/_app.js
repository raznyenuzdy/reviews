import { Box, Flex, Center, ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/Layout';
import { extendTheme } from '@chakra-ui/react'
import initFontAwesome from '../utils/initFontAwesome';
import { GrantsContextProvider } from '../context/auth.context';
import { ModelContextProvider } from '../context/model.context';
import { MenuContextProvider } from '../context/menu.context';
import Auth0ProviderWithHistory from './api/auth/authC';

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

function App({ Component, pageProps }) {
    return (
        <Auth0ProviderWithHistory>
            <GrantsContextProvider>
                <ModelContextProvider>
                    <MenuContextProvider>
                        <ChakraProvider theme={theme}>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </ChakraProvider>
                    </MenuContextProvider>
                </ModelContextProvider>
            </GrantsContextProvider>
        </Auth0ProviderWithHistory>
    )
}

export default App;