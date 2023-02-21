import { useRef, useState, useEffect, useCallback } from "react";
import { AccordionButton, HStack, Button, Flex, Spacer, Box } from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useMenuContext } from "../../context/menu.context";
import {invertColor, stillActual} from "../../utils/utils";
import { ChatIcon } from '@chakra-ui/icons'
import inAppEvent from '../../startup/events';
import inter from '../../startup/inter';

const CommentButtons = ({
    model,
    blockid,
    comment,
    commentscount,
    getheight,
    isediting,
    setisediting,
    opened,
    changer
}) => {

    const { grants, boss } = useGrantsContext();

    const { menu } = useMenuContext();

    const canDeleteConditions = {};
    canDeleteConditions.commentDeleted = !comment.deleted; //already deleted comment can't be again deleted
    //canDeleteConditions.commentClosed = (!comment.closed || (comment.closed && (!commentscount || commentscount <= 0))); //if closed without tree, can be deleted
    canDeleteConditions.thisMyComment = comment.ref_user === grants?.id && comment.ref_user > 0; //user not null and currently logged
    canDeleteConditions.stillActual = stillActual(comment); //comment pretty fresh to delete, nobody read it during timeout
    canDeleteConditions.hasNoTree = (!commentscount || commentscount <= 0); //my comment has no tree, just boss can delete with tree

    const canEditConditions = {};
    canEditConditions.commentDeleted = !comment.deleted;
    //    canEditConditions.commentClosed = (!comment.closed || (comment.closed && (!commentscount || commentscount <= 0)));
    canEditConditions.thisMyComment = comment.ref_user === grants?.id && comment.ref_user > 0;
    canEditConditions.stillActual = stillActual(comment);
    canEditConditions.hasNoTree = (!commentscount || commentscount <= 0);

    const youCanEdit = boss || Object.values(canEditConditions).reduce((c, v) => c & v);

    const youCanDelete = boss || Object.values(canDeleteConditions).reduce((c, v) => c & v);

    const blockButtonFontSize = ['md', 'md', 'lg', 'xl', 'lg'];

    const [closed, setClosed] = useState(_branchClosed());

    const editor = () => {
        inter.set('heightc' + comment.id, getheight);
        setisediting(true);
    }

    const setActiveComment = (e) => {
        menu.replyForm.isOpen
    }

    function _branchClosed() {
        if (comment.closed) return true;
        const checkMyParent = (id) => {
            return model.find(b => b.id === blockid).comments.find(c => c.id === id)
        }
        let ref_parent = comment.ref_parent;
        while (ref_parent > 0) {
            const comment = model.find(b => b.id === blockid).comments.find(c => c.id === ref_parent);
            if (comment.closed) return true;
            ref_parent = comment.ref_parent;
        }
        return false;
    }

    const branchClosed = useCallback(() => {
        _branchClosed();
    }, [comment, model, blockid, _branchClosed])

    useEffect(() => {
        setClosed(branchClosed());
    }, [setClosed, branchClosed])

    const openDialog = () => {
        changer([0]);
        grants?.role !== '' ? inAppEvent.emit('replyOnComment', comment) : inAppEvent.emit('signInPrompt');
    }

    const openDeleteCommentDialog = () => {
        inAppEvent.emit('deleteCommentAlert', { boss, comment, comments: commentscount });
    }

    const aref = useRef(null);

    const color1 = opened.length > 0 || commentscount === 0 ? invertColor('gray.600') : invertColor('teal.600');

    return (
        <Flex p='0' pr='2' direction='row' w='100%' bg={invertColor('gray.200')} fontSize={blockButtonFontSize} justifyContent='space-between'>
            <AccordionButton w='auto' ref={aref}>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <ChatIcon w={'1rem'} h={'1rem'} color={color1} />
                    <Box pl='2' color={color1}>{commentscount}</Box>
                </Flex>
            </AccordionButton>
            {comment.closed ?
                <Box p={2}>discussion closed</Box> : null
            }
            {isediting ? null :
                <HStack>
                    {!closed ? (
                        <Button
                            colorScheme='teal'
                            variant='link'
                            onClick={openDialog}>
                            Reply
                        </Button>
                    ) : null}
                    {youCanEdit ? (
                        <>
                            <Spacer />
                            <Button
                                colorScheme='blue'
                                variant='link'
                                onClick={editor}>
                                Edit
                            </Button>
                        </>
                    ) : null}
                    {youCanDelete ? (
                        <>
                            <Spacer />
                            <Button
                                colorScheme='red'
                                variant='link'
                                onClick={openDeleteCommentDialog}>
                                Delete
                            </Button>
                        </>
                    ) : null}
                </HStack>
            }
        </Flex>
    )
}

export default CommentButtons;
