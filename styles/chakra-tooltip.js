import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

// define the base component styles
const baseStyle = {
    borderRadius: 'md',
    fontWeight: 'normal',
    border: '1px solid',
};

// define custom sizes
const sizes = {
    sm: defineStyle({
        fontSize: 'sm',
        py: '1',
        px: '2',
        maxW: '200px',
    }),
    md: defineStyle({
        fontSize: 'md',
        py: '2',
        px: '3',
        maxW: '300px',
    }),
    lg: defineStyle({
        fontSize: 'lg',
        py: '2',
        px: '4',
        maxW: '350px',
    }),
};

// define styles for custom variant
const colorfulVariant = defineStyle(props => {
    const { colorScheme: c } = props; // add color scheme as a prop
    return {
        _light: {
            bg: `${c}.300`,
            borderColor: `${c}.600`,
            color: `${c}.800`,
        },
        _dark: {
            bg: `${c}.600`,
            borderColor: `${c}.300`,
            color: `${c}.200`,
        },
    };
});

// define custom variants
const variants = {
    colorful: colorfulVariant,
};

// define which sizes, variants, and color schemes are applied by default
const defaultProps = {
    size: 'md',
    variant: 'colorful',
    colorScheme: 'brand',
};

// export the component theme
export const tooltipTheme = defineStyleConfig({
    baseStyle,
    sizes,
    variants,
    defaultProps,
});
