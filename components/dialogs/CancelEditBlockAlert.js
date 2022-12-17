import { useRef } from "react";
import { useDisclosure, Button } from '@chakra-ui/react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { useMenuContext } from "../../context/menu.context";
import inAppEvent from "../../startup/events";

const CancelEditBlockAlert = () => {
    const { menu, setMenu } = useMenuContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    // inAppEvent.clear('cancelEditBlock');
    inAppEvent.on('cancelEditBlock', () => {
        onOpen();
    });

    const onCancel = () => {
        onClose();
        setTimeout(() => {
            // menu.setEditing(menu.editing = null);
            inAppEvent.emit('closeBlockTextarea');
        }, 0);
    }

    const doEdit = () => {
        onClose();
        inAppEvent.emit('focusToBlockTextarea');
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