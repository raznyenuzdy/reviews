import React from 'react';
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import {invertColor} from "../utils/utils";

export const ColorModeSwitcher = props => {
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue('dark', 'light');
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);

    return (
        <IconButton
            // size={'xl'}
            rounded="full"
            variant="linkIcon"
            // colorScheme="telegram"
            color={invertColor('gray.400')}
            aria-label={`Switch to ${text} mode`}
            position="fixed"
            bottom={3}
            left={3}
            onClick={toggleColorMode}
            icon={<SwitchIcon />}
            {...props}
        />
    );
};
