import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Accordion, Tooltip, AccordionItem, AccordionPanel, Center } from '@chakra-ui/react';
import BlockForm from "./BlockForm";
import BlockHeader from './BlockHeader';
import BlockCommentButtons from './BlockCommentButtons';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { blockTextFontSize, blockFontSize, notApprovedColor, deletedColor } from "../../startup/theming";
import {blockCountReplies, stillActual, nameString, invertColor} from "../../utils/utils";

import BlockComments from "./BlockComments";
import inAppEvent from "../../startup/events";
import {httpDeleteBlock, httpDeleteComment} from "../../utils/http";

const depth = 0;

const Block = ({ id }) => {

    const { grants, boss } = useGrantsContext();

    const userName = nameString(grants?.user_model, grants);

    const { state, deleteBlock } = useModelContext();

    const [isEditing, setIsEditing] = useState(false);

    const [commentsCount, setCommentsCount] = useState(blockCountReplies(state, id));

    const [opened, setOpened] = useState([0]);

    const bi = state.model.findIndex(b => b.id === id);
    const [block, setBlock] = useState(state.model[bi]);

    const [adminStatus, setAdminStatus] = useState({approved: block.approved, closed: block.closed, deleted: block.deleted});

    const [height, setHeight] = useState(0);

    const textref = useRef(null);

    const app = () => block.approved || block.ref_user === grants?.id;

    const [approve, setApprove] = useState(app());

    const youCanSee = block.text && (boss || (block.approved && !block.deleted));

    const branchClosed = () => {
        if (block.closed) return true;
        while (block.parentId > 0) {
            if (!model.find(top => top.id === block.parentId) || block.closed) return true;
        }
        return false;
    }

    const adminCallback = (ifit) => {
        setAdminStatus(ifit);
        setApprove(app());
    }

    const UserLabel = () => {
        if (!(block?.label && !block?.type?.hidden)) return null;
        const color = invertColor(block.type.color || 'gray.500');
        return isEditing ?
            null :
            <Box pl='2' pr='2' pt='1' pb='1' bg={color} fontSize={blockTextFontSize} color='white'>{block.label || block.type.type}</Box>
    }

    const runApp = useCallback(() => {
        block.approved || block.ref_user === grants?.id;
    }, [block, grants])

    useEffect(() => {
        if (textref.current?.clientHeight) {
            setHeight(textref.current.clientHeight);
        }
        setApprove(runApp());
        // setApprove(app());
    }, [setHeight, runApp])

    const changer = c => setOpened(c);

    const setCommentsCnt = () => setCommentsCount(blockCountReplies(state, id));

    const editIt = ifIt => setIsEditing(ifIt);

    const deleteCallback = (error, data) => error ? httpError(error) : deleteBlock(data);

    const httpError = response => inAppEvent.emit('errorEvent', [response.status, response.responseData]);

    const toDeleteBlock = async data => await httpDeleteBlock(data, deleteCallback);

    inAppEvent.clear('deleteBlock' + id);
    inAppEvent.on('deleteBlock' + id, toDeleteBlock);

    const canEdit = boss || (!block.deleted && !block.closed && block.ref_user === grants?.id && stillActual(block));

    return (
        youCanSee ?
            <Box p='0' pb='8'>
                <Accordion defaultIndex={[0]} index={opened} allowMultiple pt='0' pb='0' mb='0' onChange={changer}>
                    <AccordionItem p='0' mb='0' borderBottom='0px'>
                        {block.approved ? null : <Tooltip label='Not approved yet' bg={invertColor(...notApprovedColor)}><Box h='5px' backgroundColor={notApprovedColor} /></Tooltip>}
                        {block.deleted ? <Tooltip label='Post deleted' bg={deletedColor}><Box h='5px' backgroundColor={deletedColor} /></Tooltip> : null}
                        <Box mb='0' bg={invertColor('gray.50')} w='100%' border='1px' borderColor={invertColor('gray.300')} fontSize={blockFontSize}>
                            <Box p='0' m='0' >
                                <BlockHeader block={block} admincallback={adminCallback} username={userName}/>
                                {UserLabel()}
                                {isEditing ?
                                    <BlockForm
                                    block={block}
                                    setisediting={editIt}
                                    setblock={setBlock} /> :
                                    <Box p='2' ref={textref} fontSize={blockTextFontSize}>{block.id} | {block.position} | {block.text}</Box>
                                }
                                <BlockCommentButtons
                                    isediting={isEditing}
                                    setisediting={editIt}
                                    opened={opened}
                                    block={block}
                                    setblock={setBlock}
                                    // commentscount={commentsCount}
                                    closed={branchClosed()}
                                    // collapser={collapser}
                                    getheight={height}
                                    canedit={canEdit} />
                                {branchClosed() ? (<Center><Box p={2}>discussion closed</Box></Center>) : null}
                            </Box>
                        </Box>
                        <AccordionPanel p='0' m='0'>
                            <Box pb='0' m='0'>
                                <Box pb='0' mb='4'>
                                    <BlockComments
                                        blockid={block.id}
                                        depth={depth}
                                        setcommentscountparent={setCommentsCnt}
                                    />
                                </Box>
                            </Box>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>
            : null);
}

export default Block;
