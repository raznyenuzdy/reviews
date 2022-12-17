import { useState, useEffect, useCallback, useRef } from "react";
import {
    Box, Accordion, AccordionItem, Button,
    AccordionButton, AccordionPanel, Input,
    AccordionIcon, Wrap, FormControl, Skeleton, Text, SkeletonCircle, SkeletonText, Checkbox, CheckboxGroup, Stack, Center, Container
} from '@chakra-ui/react';
import BlockForm from "./BlockForm";
import BlockHeader from './BlockHeader';
import BlockCommentButtons from './BlockCommentButtons';
import BlockAdminPanel from './BlockAdminPanel';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { useMenuContext } from "../../context/menu.context";
import { blockTextFontSize, blockFontSize } from "../../startup/theming";
import { blockCountReplies, stillActual } from "../../utils/utils";
import { applyBlockPermissions, applyUserBlock } from "../../db/model2";
import inter from '../../startup/inter';

import BlockComments from "./BlockComments";

const depth = 0;

const Block = ({
    id
}) => {
    const { state } = useModelContext();
    const [activeComment, setActiveComment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [commentsCount, setCommentsCount] = useState(blockCountReplies(state, id));
    // const [opened, setOpened] = useState([]);
    const [opened, setOpened] = useState([0]);
    //PYAV const [block, setBlock] = useState(_block);
    const [block, setBlock] = useState(state.model.find(b => b.id === id));//PYAV

    const [text, setText] = useState(block.text);
    const [label, setLabel] = useState(block.label);

    const [adminToggle, setAdminToggle] = useState(null);

    const [height, setHeight] = useState(0);

    const textref = useRef(null);

    const isReplying = activeComment &&
        activeComment.id === block.id &&
        activeComment.type === "replying";
    // const fiveMinutes = 300000;
    // const { model, setModel, adminMenu, setAdminMenu, modelLoading } = useModelContext();

    const { menu, setMenu } = useMenuContext();
    const { grants, boss, grantsLoading } = useGrantsContext();

    const timePassed = 0;//new Date() - new Date(block.createdAt) > fiveMinutes;
    const canDelete = true; //currentUserId === block.userId && backendComments.length === 0 && !timePassed;
    const canReply = true;//Boolean(currentUserId);
    // const isBoss = (grants) => ['admin', 'moder'].find(v => v === grants?.role);

    //видит босс, если аппрувлено и не удалено, то все, если не удалено, то хозяин)
    const youCanSee = block.text && (boss || (block.approved && !block.deleted) || (!block.deleted && block.ref_user === grants.id));

    // getRepliesApi(id).then((data) => {
    //     setComment(data);
    //     setReplies(data.children);
    // });

    // useEffect(() => {
    //     setReplies(state.model.filter(m => m.parentId === id && m.type.type)
    //         .map(m => {
    //             m.user = applyUserBlock(m, grants);
    //             return m
    //         }));
    // }, [state.model, id, grants, menu.adminMenu])

    const branchClosed = () => {
        if (block.closed) return true;
        while (block.parentId > 0) {
            if (!model.find(top => top.id === block.parentId) || block.closed) return true;
        }
        return false;
    }

    // const textref = element => {
    //     console.log(element);
    // }

    const addComment = async (text, parentId) => {
        // const reply = await createCommentApi(text, parentId);
        // block.children.push(block);
        // setComment(block);
        // block.children = block.children ? block.children.concat(reply) : [reply];
        setModel(model.concat(reply));
        // replies = replies ? replies.concat(reply) : [reply];
        setReplies(block.children);
        setActiveComment(null);
    };

    const updateComment = (text, commentId) => {
        const block = updateCommentApi(text);
    };

    const deleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to remove block?")) {
            await deleteCommentApi(commentId);
            // setComment(null);
            setReplies(null);
        }
    };

    const replyForm = () => {
        return <BlockForm id={id} />
    }

    const UserLabel = () => {
        if (!(block?.label && !block?.type?.hidden)) return null;
        const color = block.type.color || 'gray.500';
        return isEditing ?
            null :
            <Box pl='2' pr='2' pt='1' pb='1' bg={color} fontSize={blockTextFontSize} color='white'>{block.label || block.type.type}</Box>
    }

    useEffect(() => {
        if (textref.current?.clientHeight) {
            setHeight(textref.current.clientHeight);
        }
    }, [setHeight])

    const changer = (c) => {
        setOpened(c);
    }

    const collapser = () => {
        // setCollapsed([0]);
    }

    const setcommentscount = () => {
        const aa = blockCountReplies(state, id);
        // console.log("BBBCOUNT:", id, aa);
        setCommentsCount(aa);
    }

    const canedit = boss || (!block.deleted && !block.closed && block.ref_user === grants?.id && stillActual(block));
    return (
        youCanSee ?
            <Box p='0' pb='8'>
                <Accordion defaultIndex={[0]} index={opened} allowMultiple pt='0' pb='0' mb='0' onChange={changer}>
                    <AccordionItem p='0' mb='0' borderBottom='0px'>
                        <Box mb='0' bg='gray.50' w='100%' border='1px' borderColor='gray.300' fontSize={blockFontSize}>
                            <Box p='0' m='0' >
                                <BlockHeader block={block} admin={adminToggle} />
                                {UserLabel()}
                                {isEditing ?
                                    <BlockForm
                                    block={block}
                                    grants={grants}
                                    setisediting={setIsEditing}
                                    setblock={setBlock} /> :
                                    <Box p='2' ref={textref} fontSize={blockTextFontSize}>{block.text}</Box>
                                }
                                <BlockCommentButtons
                                    isediting={isEditing}
                                    setisediting={setIsEditing}
                                    opened={opened}
                                    block={block}
                                    setblock={setBlock}
                                    // commentscount={commentsCount}
                                    closed={branchClosed()}
                                    // collapser={collapser}
                                    getheight={height}
                                    canedit={canedit} />
                                {branchClosed() ? (<Center><Box p={2}>discussion closed</Box></Center>) : null}
                            </Box>
                        </Box>
                        <AccordionPanel p='0' m='0'>
                            <Box pb='0' m='0'>
                                <Box pb='0' mb='4'>
                                    <BlockComments
                                        blockid={block.id}
                                        depth={depth}
                                        setcommentscountparent={setcommentscount}
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