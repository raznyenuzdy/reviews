import { extendTheme } from '@chakra-ui/react'
import { checkboxAnatomy as parts } from "@chakra-ui/anatomy"
import {createMultiStyleConfigHelpers, defineStyle, defineStyleConfig, useColorModeValue} from "@chakra-ui/react";
import {invertColor} from "../utils/utils";

export const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']; //base sizes

export const blockTextFontSize = ['md', 'md', 'lg', 'md', 'md'];

export const blockFontSize = ['md', 'md', 'md', 'lg', 'lg'];

export const replyFontSize = ['sm', 'sm', 'md', 'md', 'md'];

export const replyTextareaFontSize = ['sm', 'sm', 'md', 'md', 'md'];

export const maxWidthDashboardAdmin = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export const maxWidthLayout = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export const paddingLayout = [0,0,0,2,4,4];

export const avatarNavBarSize = ['sm'];

export const linkFontSize = ['sm'];

export const navbarFontSize = ['xs','sm','md','lg','xl'];

export const blockFormButtonFontSize = ['sm'];

export const avatarBlockHeader = ['md', 'md', 'md', 'md', 'md'];

export const commentFontSize = ['md', 'md', 'md', 'md', 'md'];

export const commentHeaderFontSize = ['md', 'md', 'md', 'lg', 'lg'];

export const commentAuthorFontSize = ['md', 'md', 'lg', 'lg', 'md'];

export const paddingTextReply = ['2'];

export const blockButtonFontSize = ['md', 'md', 'lg', 'xl', 'lg'];

export const blockHeaderFontSize = ['md', 'md', 'xl', 'xl', 'xl'];

export const blockTimerFontSize = ['md', 'md', 'md', 'md', 'md'];

export const notApprovedColor = ['orange'];

export const deletedColor = 'red.400';

const linkIcon = defineStyle({
    fontSize: "30px",

    _hover: {
        transform: "scale(1.1)",
        color: "green.400"
    },

    _active: {
        color: "green.600"
    },

});

export const buttonTheme = defineStyleConfig({
    variants: { linkIcon },
})

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys)

// default base style from the Checkbox theme
const baseStyle = definePartsStyle({
    label: {
        // fontFamily: "mono"
    },
    control: {
        padding: 2,
        borderRadius: 4,
        borderColor: 'gray.400'
    }
})

// Defining a custom variant
const variantCircular1 = definePartsStyle({
    control: defineStyle({
        // rounded: "full",
        bg: 'gray.200',
    }),
})

const variantCircular2 = definePartsStyle({
    control: defineStyle({
        // rounded: "full",
        bg: 'gray.100',
    }),
})

const variants = {
    checkbox1: variantCircular1,
    checkbox2: variantCircular2,
}

const sizesCheckbox = {
    xl: definePartsStyle({
        control: defineStyle({
            // boxSize: 14,
            // bg: 'white'
        }),
        label: defineStyle({
            // fontSize: "2xl",
            marginLeft: 6
        })
    })
}

export const checkboxTheme = defineMultiStyleConfig({
    baseStyle,
    variants,
    sizesCheckbox,
})

// 2. Add your color mode config
export const themeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
}

// 3. extend the theme
// export default theme
