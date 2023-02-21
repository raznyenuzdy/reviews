import React, { useState } from 'react';
import {Box, useColorModeValue} from '@chakra-ui/react';
import Config from '../../startup/config';
import Comment from './Comment';
import { useModelContext } from '../../context/model.context';
import inAppEvent from '../../startup/events';

const BlockComments = ({
    blockid,
    parentid,
    depth,
    setcommentscountparent
}) => {

    const { state } = useModelContext();

    if ((!state?.model.find(b => b.id === blockid) || {}).comments) {
        (state?.model.find(b => b.id === blockid) || {}).comments = [];
    }

    const [block, setBlock] = useState(state?.model.find(b => b.id === blockid) || {});
    if (parentid) {
        inAppEvent.clear('addCommentEvent' + blockid + ':' + parentid || '');
        inAppEvent.on('addCommentEvent' + blockid + ':' + parentid || '', addComment);
    } else {
        inAppEvent.clear('addCommentEvent_' + blockid + ':');
        inAppEvent.on('addCommentEvent_' + blockid + ':', addComment);
    }

    depth++;

    function cutComment(data) {
        if (!Array.isArray(block.comments)) return;
        const i = block.comments.findIndex(c => c.id == data.responseData.id);
        if (i < 0) return;
        block.comments.splice(i, 1);
        setBlock({...block});//мутация только так, мeтабельность splice походу относится только к содержимому массива
        setcommentscountparent();//эта штука тоже форсит рендеринг
    }

    function addComment(responseData) {
        block.comments.push(responseData);
        setBlock({...block});
        setcommentscountparent();
    }

    const off = (step, max = Config.commentsDepth) => {
        return depth <= max ? step : 0
    }

    const bc = useColorModeValue('#eee', '#444');

    const b = (depthMax = Config.commentsDepth) => {
        return depth <= depthMax ? '1px solid ' + bc : '0px'
    }

    return (block.comments?.length <= 0 ? null :
        <Box mb='0'>
            <Box pt='0' mb='0' pl={[off(0, 0), off(0, 0), off(2, 2), off(2, 1), off(5)]} borderLeft={[b(0), b(0), b(0), b(0), b()]} >
                {block.comments.filter(c => parentid ? c.ref_parent === parentid : c.ref_parent === null).map((comment) => (
                    <Comment
                        id={comment.id}
                        key={'comment' + comment.id}
                        blockid={blockid}
                        depth={depth}
                        comment={comment}
                        cutcomment={cutComment}
                        setcommentscountparent={setcommentscountparent}
                    />
                ))}
            </Box>
        </Box>
    )
}

export default BlockComments;
