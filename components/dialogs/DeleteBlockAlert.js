import { useRef, useState } from "react";
import { useDisclosure, Button, Box, Text } from '@chakra-ui/react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import inAppEvent from "../../startup/events";
import {useGrantsContext} from "../../context/auth.context";

const DeleteBlockAlert = () => {

    const { boss } = useGrantsContext();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const cancelRef = useRef();

    const [params, setParams] = useState({});

    inAppEvent.clear('deleteBlockAlert');
    inAppEvent.on('deleteBlockAlert', (params) => {
        onOpen();
        setParams(params);
    });

    const onCancel = () => {
        onClose();
    }

    const delIt = () => {
        onClose();
        if (params)
            inAppEvent.emit('deleteBlock' + params.block.id, params.block);
    }

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCancel}
                onOverlayClick={onCancel}
                onEsc={onCancel}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Do you really want to delete this {boss ? 'your' : null} article?
                            {params?.block?.comments?.length > 0 ? <><br />With {params.block.comments.length} underneath comments tree</> : null}?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Box>{params?.block?.text.substring(0, 260)}..</Box>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button colorScheme='green' ref={cancelRef} onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={delIt} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default DeleteBlockAlert;
