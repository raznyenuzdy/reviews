import { useRef, useState } from "react";
import { useDisclosure, Button } from '@chakra-ui/react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import inAppEvent from "../../startup/events";

const CancelEditBlockAlert = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [eventNameCancel, setEventNameCancel] = useState('');

    const [eventNameEdit, setEventNameEdit] = useState('');

    const cancelRef = useRef();

    inAppEvent.on('cancelEditBlock', () => {
        setEventNameCancel('closeBlockTextarea');
        setEventNameEdit('focusToBlockTextarea');
        onOpen();
    });

    inAppEvent.on('cancelEditComment', () => {
        setEventNameCancel('closeCommentTextarea');
        setEventNameEdit('focusToCommentTextarea');
        onOpen();
    });

    const onCancel = () => {
        onClose();
        setTimeout(() => {
            inAppEvent.emit(eventNameCancel);
        }, 0);
    }

    const doEdit = () => {
        onClose();
        inAppEvent.emit(eventNameEdit);
    }

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                onOverlayClick={doEdit}
                onEsc={doEdit}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Cancel text editing
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <b>Are you sure?</b> <br />
                            If You will press Cancel,<br />
                            <b>You will loose all made changes</b><br />
                            You can&apos;t undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button colorScheme='red' ref={cancelRef} onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button onClick={doEdit} ml={3}>
                                Continue editing
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default CancelEditBlockAlert;