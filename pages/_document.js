import { ColorModeScript } from '@chakra-ui/react'
import { Html, Head, Main, NextScript } from 'next/document'
import {themeConfig} from '../startup/theming'

export default function Document() {
    return (
        <Html>
            <Head />
            <body>
            <ColorModeScript initialColorMode={themeConfig.initialColorMode} />
            <Main />
            <NextScript />
            </body>
        </Html>
    )
}
