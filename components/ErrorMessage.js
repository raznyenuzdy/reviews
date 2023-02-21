import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import inAppEvent from '../startup/events';

const ErrorMessage = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [text, setText] = useState('');

    const cancelRef = useRef();

    inAppEvent.clear('errorMessage');
    inAppEvent.on('errorMessage', handleError);

    function handleError(text) {
        if (!isOpen) {
            setText(text);
            onOpen()
        }
    }

    const close = () => {
        setText('');
        onClose();
    }

    return (
        <>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>Error message</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {text}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={close}>
                            Close
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ErrorMessage;