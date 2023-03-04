import { useState, useEffect, useCallback, useRef } from "react";
import {Accordion, AccordionItem, AccordionPanel, Box, Tooltip, useColorModeValue} from '@chakra-ui/react';
import CommentButtons from './CommentButtons';
import BlockComments from './BlockComments';
import CommentForm from './CommentForm';
import CommentHeader from './CommentHeader';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { commentHeaderFontSize, commentFontSize, notApprovedColor } from '../../startup/theming';
import { countReplies, stillActual, buildName, invertColor } from "../../utils/utils";
import inAppEvent from '../../startup/events';
import { httpDeleteComment } from "../../utils/http";
import inter from "../../startup/inter";

const Comment = ({ depth, id, blockid, cutcomment, setcommentscountparent }) => {

    const { grants, boss } = useGrantsContext();

    const { state } = useModelContext();

    const bi = state.model.findIndex(b => b.id == blockid);
    const ci = state.model[bi].comments.findIndex(c => c.id == id);

    const [comment, setComment] = useState(state.model[bi].comments[ci]);

    const [adminStatus, setAdminStatus] = useState({approved: comment.approved, closed: comment.closed, deleted: comment.deleted});

    const [isEditing, setIsEditing] = useState(false);

    const [commentsCount, setCommentsCount] = useState(countReplies(state, id));

    const [activeComment, setActiveComment] = useState(null);

    const [height, setHeight] = useState(0);

    const [opened, setOpened] = useState(inter.get('accordeon' + id) || []);

    const textref = useRef(null);

    const app = comment.approved || comment.ref_user === grants?.id;

    const [approve, setApprove] = useState(app);

    const youCanSee = !!boss || (!!app && !comment.deleted);// || (!comment.deleted && comment.ref_user === grants.id)

    const userName = buildName(comment.user_model);

    const addComment = async (text, parentId) => {
        setModel(model.concat(reply));
        setReplies(comment.children);
        setActiveComment(null);
    };

    const runApp = useCallback(() => {
        comment.approved || comment.ref_user === grants?.id;
    }, [grants])

    useEffect(() => {
        if (textref.current?.clientHeight) {
            setHeight(textref.current.clientHeight);
        }
        setApprove(runApp());
    }, [setHeight, runApp])

    const setcommentscount = () => {
        const aa = countReplies(state, id);
        setCommentsCount(aa);
        if (setcommentscountparent) setcommentscountparent();
    }

    const adminCallback = (ifit) => {
        setAdminStatus(ifit);
        setApprove(app);
    }

    const changer = (index) => {
        setOpened(index);
        inter.set('accordeon' + id, index);
    }

    const deleteCallback = (error, data) => {
        error ? httpError(error) : cutcomment(data);
    }

    const toDeleteComment = async (data) => {
        console.log("DDDDDD", data);
        await httpDeleteComment(data, deleteCallback);
    }

    const httpError = async (response) => {
        inAppEvent.emit('errorEvent', [response.status, response.responseData]);
    }

    inAppEvent.clear('deleteComment' + id);
    inAppEvent.on('deleteComment' + id, toDeleteComment);

    const canedit = boss || (!comment.deleted && !comment.closed && comment.ref_user === grants?.id && stillActual(comment));

    const _invertColor = (color) => {
        const [name, depth] = color.split(".");
        return useColorModeValue(name + '.' + depth, name + '.' + (900 - parseInt(depth)).toString());
    }

    return (
        youCanSee ?
            <Box pb='0'>
                <Accordion defaultIndex={opened} index={opened} allowMultiple pt='4' pb='0' onChange={changer}>
                    <AccordionItem p='0' border='0px'>
                        {comment.approved ? null : <Tooltip label='Comment not yet approved' bg={notApprovedColor}><Box h='5px' backgroundColor={notApprovedColor} /></Tooltip>}
                        <Box border='1px' borderColor={invertColor("gray.300")} w='100%'>
                            <Box bg={invertColor("gray.50")} w='100%' fontSize={commentHeaderFontSize}>
                                <CommentHeader comment={comment} username={userName} admincallback={adminCallback}>
                                {isEditing ?
                                    <CommentForm
                                    comment={comment}
                                    setisediting={setIsEditing}
                                    setcomment={setComment} /> :
                                    <Box ref={textref} fontSize={commentFontSize}>{comment.text}</Box>
                                }
                                </CommentHeader>
                            </Box>
                            <CommentButtons
                                model={state.model}
                                blockid={blockid}
                                comment={comment}
                                isediting={isEditing}
                                setisediting={setIsEditing}
                                commentscount={commentsCount}
                                // canedit={canedit}
                                getheight={height}
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
