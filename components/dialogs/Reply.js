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
    Text,
    Box,
    Textarea,
} from '@chakra-ui/react';
import CommentHeader from '../block/CommentHeader';
import { useDisclosure } from '@chakra-ui/react';
import { useMenuContext } from "../../context/menu.context";
import { useGrantsContext } from "../../context/auth.context";
import inAppEvent from '../../startup/events';
import { replyTextareaFontSize, sizes, commentHeaderFontSize } from '../../startup/theming';
import { key } from "../../utils/utils";

const ReplyToComment = () => {
    const { grants, grantsLoading } = useGrantsContext();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [data, setData] = useState({});
    const [_key, setKey] = useState();
    const [text, setText] = useState({});
    const [disable, setDisable] = useState(false);

    inAppEvent.clear('replyOnComment');
    inAppEvent.on('replyOnComment', (data) => {
        setKey(key());
        setDisable(false);
        setData(data);
        onOpen();
    });

    const isTextareaEmty = text.length === 0;

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
        />
    )

    const [overlay, setOverlay] = useState(<OverlayOne />);
    const { menu, setMenu } = useMenuContext();
    menu.replyForm = { isOpen, onOpen, onClose };

    const OverlayTwo = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='2px'
        />
    )

    const canSave = () => {
        return !isTextareaEmty && !disable
    }

    const cancel = () => {
        menu.replyForm.onClose();
    }

    const postReplyComment = async () => {
        try {
            setDisable(true);
            grants.token = grants.token ? grants.token : await getAccessTokenSilently();
            const reply = {
                ref_block: data.ref_block,
                ref_parent: data.id,
                text
            };
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${grants.token}`,
                    'Content-type': 'application/json',
                    'key': _key
                },
                body: JSON.stringify(reply),
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/comment`,
                options
            );
            const responseData = await response.json();
            if (response.status !== 201) {
                inAppEvent.emit('errorEvent', [response.status, responseData]);
            }
            onClose();
            inAppEvent.emit('addCommentEvent' + data.ref_block + ':' + data.id, responseData);
        } catch (error) {
            inAppEvent.emit('errorEvent', [500, error]);
        }
    }

    return (
        <Modal isCentered size={sizes} isOpen={isOpen} onClose={onClose}>
            {overlay}
            <ModalContent>
                <ModalHeader pb='0'>
                    <Box>Replying to:</Box>
                </ModalHeader>
                <ModalCloseButton size='lg' />
                <ModalBody p='0' pl={['1', '1', '1', '4', '6']} pr={'4'} mt={4}>
                    <CommentHeader isreply='true'>
                        <Box fontSize={commentHeaderFontSize}>{data.text}</Box>
                    </CommentHeader>
                    <CommentHeader comment={data}>
                        <Textarea
                            p={['5px', '', '', '', '', '']}
                            // m={0}
                            placeholder=""
                            bg='orange.50'
                            size='sm'
                            w='100%'
                            h='6em'
                            fontSize={replyTextareaFontSize}
                            className="comment-form-textarea"
                            onChange={(e) => setText(e.target.value)}
                        />
                    </CommentHeader>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup variant='solid' spacing='6'>
                        <Button
                            // colorScheme='blue'
                            variant='solid'
                            colorScheme='facebook'
                            size={['md']}
                            type='submit'
                            onClick={postReplyComment}
                            disabled={!canSave()}>
                            Write review
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ReplyToComment;