import { extendTheme } from '@chakra-ui/react';
import {tooltipTheme} from "./chakra-tooltip";

const theme = extendTheme({
    // add a custom color scheme
    colors: {
        brand: {
            50: '#ffeae1',
            100: '#fdc8b6',
            200: '#f5a489',
            300: '#f0805b',
            400: '#eb5d2d',
            500: '#d24314',
            600: '#a4330f',
            700: '#76240a',
            800: '#481403',
            900: '#1e0400',
        },
    },
    // add a new component theme
    components: {
        Tooltip: tooltipTheme,
    },
});

export default theme;
