import { useRef } from "react";
import { AccordionButton, HStack, Button, Flex, Spacer, Box } from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useMenuContext } from "../../context/menu.context";
import { stillActual } from "../../utils/utils";
import { ChatIcon } from '@chakra-ui/icons'
import inAppEvent from '../../startup/events';

const CommentButtons = ({
    comment,
    commentscount,
    expanded,
    canedit,
    opened,
    changer
}) => {

    const { grants, boss } = useGrantsContext();

    const { menu } = useMenuContext();

    const canDeleteConditions = {};
    canDeleteConditions.commentDeleted = !comment.deleted; //already deleted comment can't be again deleted
    canDeleteConditions.commentClosed = (!comment.closed || (comment.closed && (!commentscount || commentscount <= 0))); //if closed without tree, can be deleted
    canDeleteConditions.thisMyComment = comment.ref_user === grants?.id && comment.ref_user > 0; //user not null and currently logged
    canDeleteConditions.stillActual = stillActual(comment); //comment pretty fresh to delete, nobody read it during timeout
    canDeleteConditions.hasNoTree = (!commentscount || commentscount <= 0); //my comment has no tree, just boss can delete with tree
    const youCanDelete = boss || Object.values(canDeleteConditions).reduce((c, v) => c & v);

    const blockButtonFontSize = ['md', 'md', 'lg', 'xl', 'lg'];

    const editor = () => {
        menu.reviewForm.isOpen ? menu.reviewForm.onClose() : menu.reviewForm.onOpen();
    }

    const setActiveComment = (e) => {
        menu.replyForm.isOpen
    }

    const branchClosed = () => {
        if (comment.closed) return true;
        while (comment.parentId > 0) {
            if (!model.find(top => top.id === comment.parentId) || comment.closed) return true;
        }
        return false;
    }

    const openDialog = () => {
        changer([0]);
        console.log("GGG:", grants?.role !== '');
        grants?.role !== '' ? inAppEvent.emit('replyOnComment', comment) : inAppEvent.emit('signInPrompt');
    }

    const openDeleteCommentDialog = () => {
        inAppEvent.emit('deleteCommentAlert', {boss, comment, comments: commentscount});
    }

    const aref = useRef(null);

    return (
        <Flex p='0' pr='2' direction='row' w='100%' bg='gray.200' fontSize={blockButtonFontSize} justifyContent='space-between'>
            <AccordionButton w='auto' ref={aref}>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <ChatIcon w={'1rem'} h={'1rem'} color={opened.length > 0 || commentscount === 0 ? '#bbb' : 'teal'} />
                    <Box pl='2' color={opened.length > 0 || commentscount === 0 ? '#bbb' : 'teal'}>{commentscount}</Box>
                </Flex>
            </AccordionButton>
            {branchClosed() ?
                <Box p={2}>discussion closed</Box> : null
            }
            <HStack>
                {!branchClosed() ? (
                    <Button
                        colorScheme='teal'
                        variant='link'
                        onClick={openDialog}>
                        Reply
                    </Button>
                ) : null}
                {canedit ? (
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
        </Flex>
    )
}

export default CommentButtons;