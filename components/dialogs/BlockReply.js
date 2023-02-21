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
    Box,
    Textarea,
} from '@chakra-ui/react';
import CommentHeader from '../block/CommentHeader';
import LoginButton from '../LoginButton';
import { useDisclosure } from '@chakra-ui/react';
import { useMenuContext } from "../../context/menu.context";
import { useGrantsContext } from "../../context/auth.context";
import inAppEvent from '../../startup/events';
import { replyTextareaFontSize, sizes, commentHeaderFontSize } from '../../startup/theming';
import { key } from "../../utils/utils";
import { useUser } from '@auth0/nextjs-auth0/client';
import { httpApi } from "../../utils/http";

const ReplyToBlock = () => {
    const { user } = useUser();
    const { grants } = useGrantsContext();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [data, setData] = useState({});
    const [_key, setKey] = useState();
    const [text, setText] = useState({});
    const [disable, setDisable] = useState(false);

    inAppEvent.clear('replyOnBlock');
    inAppEvent.on('replyOnBlock', (data) => {
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

    const postReplyBlock = async () => {
        try {
            const body = {
                ref_block: data.id,
                text
            };
            const headers = {'key': _key};
            const response = await httpApi('POST', '/api/comment', headers, body);
            if (!response) {onClose(); return;}
            if (response.status !== 201) {
                inAppEvent.emit('errorEvent', [response.status, response.responseData]);
                onClose();
                return;
            }
            onClose();
            inAppEvent.emit('addCommentEvent_' + data.id + ':', response.responseData);
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
                    <CommentHeader isreply inreply>
                        <Box pt='4' fontSize={commentHeaderFontSize}>{data.label}</Box>
                    </CommentHeader>
                    <CommentHeader comment={data} inreply>
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
                        {user ?
                        <Button
                            // colorScheme='blue'
                            variant='solid'
                            colorScheme='facebook'
                            size={['md']}
                            type='submit'
                            onClick={postReplyBlock}
                            disabled={!canSave()}>
                            Write review{grants?.role}
                        </Button> :
                            <LoginButton
                            colorScheme="blue"
                            size='lg'
                            href="/api/auth/login"
                            className="btn btn-primary btn-block"
                            tabIndex={0}
                            testId="navbar-login-mobile">
                            Log in to write review
                        </LoginButton>}
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ReplyToBlock;