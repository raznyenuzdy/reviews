import { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    ButtonGroup,
    Button,
    Link,
    Box,
    Textarea,
    HStack,
    Image,
} from '@chakra-ui/react';
import CommentHeader from '../block/CommentHeader';
import { useDisclosure } from '@chakra-ui/react';
import { useMenuContext } from "../../context/menu.context";
import { useGrantsContext } from "../../context/auth.context";
import inAppEvent from '../../startup/events';
import { replyTextareaFontSize, sizes, commentHeaderFontSize } from '../../startup/theming';
import { key } from "../../utils/utils";

const SignInPrompt = () => {
    const { grants, grantsLoading } = useGrantsContext();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [data, setData] = useState({});

    inAppEvent.clear('signInPrompt');
    inAppEvent.on('signInPrompt', (data) => {
        if (grants.role) console.log('ALREADY AUTH');
        onOpen();
    });

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
        />
    )

    const [overlay, setOverlay] = useState(<OverlayOne />);

    return (
        <Modal isCentered size={sizes} isOpen={isOpen} onClose={onClose}>
            {overlay}
            <ModalContent>
                <ModalHeader pb='0'>
                    <Box>Sign in to leave comment or review.</Box>
                </ModalHeader>
                <ModalCloseButton size='lg' />
                <ModalBody p='0' pl={['1', '1', '1', '4', '6']} pr={'4'} mt={4}>
                    <HStack>
                    <Link href='/app/auth/login'><Image src='/images/google.svg' alt='google'/><Box fontSize={commentHeaderFontSize}>Log in with Google</Box></Link>
                    <Box borderLeft='1px solid grey' pl='2'>Login with username and password</Box>
                    </HStack>
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SignInPrompt;