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
import { useMenuContext } from "../../context/menu.context";
import inAppEvent from "../../startup/events";

const DeleteCommentAlert = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const cancelRef = useRef();

    const [params, setParams] = useState({});

    inAppEvent.clear('deleteCommentAlert');
    inAppEvent.on('deleteCommentAlert', (params) => {
        onOpen();
        setParams(params);
    });

    const onCancel = () => {
        onClose();
    }

    const delIt = () => {
        onClose();
        if (params.comment)
            inAppEvent.emit('deleteComment' + params.comment.id, params.comment);
    }

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                onOverlayClick={delIt}
                onEsc={delIt}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Are you about to delete {params?.boss ? 'your' : null} comment
                            {params?.comments ? <><br />With {params.comments} underneath comments tree</> : null}?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Box>{params?.comment?.text.substring(0, 60)}</Box>
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

export default DeleteCommentAlert;