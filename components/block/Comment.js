import { useState } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    Box,
} from '@chakra-ui/react';
import CommentButtons from './CommentButtons';
import BlockComments from './BlockComments';
import CommentHeader from './CommentHeader';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { commentHeaderFontSize, commentFontSize } from '../../startup/theming';
import { countReplies, stillActual } from "../../utils/utils";
import inAppEvent from '../../startup/events';
import { httpDeleteComment } from "../../utils/http";
import inter from "../../startup/inter";

const Comment = ({
    depth, id, blockid, comment, comments, cutcomment, setcommentscountparent
}) => {

    const { state } = useModelContext();

    const [closed, setClosed] = useState(comment.closed || false);

    const [commentsCount, setCommentsCount] = useState(countReplies(state, id));

    const [activeComment, setActiveComment] = useState(null);

    const [opened, setOpened] = useState(inter.get('accordeon' + id) || []);

    const { grants, boss } = useGrantsContext();

    const youCanSee = boss || (comment.approved && !comment.deleted) || (!comment.deleted && comment.ref_user === grants.id);

    const addComment = async (text, parentId) => {
        setModel(model.concat(reply));
        setReplies(comment.children);
        setActiveComment(null);
    };


    const setcommentscount = () => {
        const aa = countReplies(state, id);
        setCommentsCount(aa);
        if (setcommentscountparent) setcommentscountparent();
    }

    const adminCallback = (ifit) => {
        setClosed(ifit);
    }

    const changer = (index) => {
        setOpened(index);
        inter.set('accordeon' + id, index);
    }

    const deleteCallback = (error, data) => {
        error ? httpError(error) : cutcomment(data);
    }

    const toDeleteComment = async (data) => {
        await httpDeleteComment(grants, data, deleteCallback);
    }

    const httpError = async (data) => {
        inAppEvent.emit('errorEvent', [data.response.status, data.responseData]);
    }

    inAppEvent.clear('deleteComment' + id);
    inAppEvent.on('deleteComment' + id, toDeleteComment);

    const canedit = boss || (!comment.deleted && !comment.closed && comment.ref_user === grants?.id && stillActual(comment));

    return (
        youCanSee ?
            <Box pb='0'>
                <Accordion defaultIndex={opened} index={opened} allowMultiple pt='4' pb='0' onChange={changer}>
                    <AccordionItem p='0' border='0px'>
                        <Box border='1px' borderColor='gray.300' w='100%'>
                            <Box bg='gray.50' w='100%' fontSize={commentHeaderFontSize}>
                                <CommentHeader comment={comment} admincallback={adminCallback}>
                                    <Box fontSize={commentFontSize}>{comment.text}</Box>
                                </CommentHeader>
                            </Box>
                            <CommentButtons
                                comment={comment}
                                commentscount={commentsCount}
                                canedit={canedit}
                                opened={opened}
                                changer={changer} />
                        </Box>
                        <AccordionPanel p='0' m='0' mb='0'>
                            <Box pb='0' m='0' mb='0'>
                                <Box pb='0' mb='0'>
                                    <BlockComments
                                        parentid={comment.id}
                                        blockid={blockid}
                                        depth={depth}
                                        isopened={opened}
                                        accord={setOpened}
                                        setcommentscountparent={setcommentscount} />
                                </Box>
                            </Box>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>
            : null);
}

export default Comment;
