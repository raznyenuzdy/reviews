import { useState, useEffect } from "react";
import { Box, FormControl, Skeleton, Text, SkeletonCircle, SkeletonText, Checkbox, CheckboxGroup, Stack, Center } from '@chakra-ui/react';
import CommentForm from "./CommentForm";
import CommentHeader from './CommentHeader';
import CommentButtons from './CommentButtons';
import CommentReplies from './CommentReplies';
import AdminPanel from './AdminPanel';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { useMenuContext } from "../../context/menu.context";
import { applyBlockPermissions, applyUserBlock } from "../../db/model2";

import {
    getReplies as getRepliesApi,
    createComment as createCommentApi,
    updateComment as updateCommentApi,
    deleteComment as deleteCommentApi,
} from "../../db/model";

const Comment = ({
    comment, depth, id
}) => {
    // const [comment, setComment] = useState(block);
    const [children, setChildren] = useState([]);
    const [replies, setReplies] = useState(null);
    const [_refresh, setRefresh] = useState(false);
    const [activeComment, setActiveComment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const isReplying = activeComment &&
        activeComment.id === comment.id &&
        activeComment.type === "replying";
    // const fiveMinutes = 300000;
    // const { model, setModel, adminMenu, setAdminMenu, modelLoading } = useModelContext();
    const [state, setState] = useModelContext();
    const { menu, setMenu } = useMenuContext();
    // const [adminMenu, setAdminMenu] = useState(model.adminMenu);
    const { grants, grantsLoading } = useGrantsContext();

    const timePassed = 0;//new Date() - new Date(comment.createdAt) > fiveMinutes;
    const canDelete = true; //currentUserId === comment.userId && backendComments.length === 0 && !timePassed;
    const canReply = true;//Boolean(currentUserId);
    const canEdit = true;//currentUserId === comment.userId && !timePassed;
    // const isBoss = (grants) => ['admin', 'moder'].find(v => v === grants?.role);
    const isBoss = ['admin', 'moder'].find(v => v === grants?.role);

    //видит босс, если аппрувлено и не удалено, то все, если не удалено, то хозяин)
    const youCanSee = isBoss || (comment.approved && !comment.deleted) || (!comment.deleted && comment.ref_user === grants.id);

    const commentFontSize = ['md','md','lg','md','md'];

    // getRepliesApi(id).then((data) => {
    //     setComment(data);
    //     setReplies(data.children);
    // });

    useEffect(() => {
        // console.log(model.filter(obj => obj.parentId === id)
        /*.map(m => m{
            m.permissions = applyBlockPermissions(m.type.type, grants.role);
            m.user = applyUserBlock(m.user, grants);
            return m
        })*///);
        setReplies(state.model.filter(m => m.parentId === id && m.type.type)
            .map(m => {
                // m.permissions = applyBlockPermissions(m.type.type, grants.role);
                // console.log("PERM:", m.permissions);
                m.user = applyUserBlock(m, grants);
                return m
            }));
    }, [state.model, id, grants, menu.adminMenu])

    const branchClosed = () => {
        let block = comment;
        if (block.closed) return true;
        while (block.parentId > 0) {
            block = model.find(top => top.id === block.parentId)
            if (!block || block.closed) return true;
        }
        return false;
    }

    const addComment = async (text, parentId) => {
        // const reply = await createCommentApi(text, parentId);
        // comment.children.push(comment);
        // setComment(comment);
        // comment.children = comment.children ? comment.children.concat(reply) : [reply];
        setModel(model.concat(reply));
        // replies = replies ? replies.concat(reply) : [reply];
        setReplies(comment.children);
        setActiveComment(null);
    };

    const updateComment = (text, commentId) => {
        const comment = updateCommentApi(text);
    };

    const refr = () => {
        setRefresh(true)
    }

    const deleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to remove comment?")) {
            await deleteCommentApi(commentId);
            // setComment(null);
            setReplies(null);
            refresh(true);
        }
    };

    const replyForm = () => {
        return <CommentForm
            comment={comment}
            handleSubmit={(text) => updateComment(text, id)}
            handleCancel={() => {
                // setActiveComment(null);
            }}
        />
    }

    const UserLabel = () => {
        if (!(comment?.label && !comment?.type?.hidden)) return null;
        const color = comment.type.color || 'gray.500';
        return <Text  pl='2' pr='2' pt='1' pb='1' bg={color} fontSize={commentFontSize} color='white'>{comment.label || comment.type.type}</Text>
    }

    return (
        youCanSee ?
            <>
                <Box border='1px' borderColor='gray.300' bg='gray.50' w='100%' mb={[2, 4, 6, 8]} fontSize={['md','md','md','xl','2xl']}>
                    {isBoss ? <AdminPanel block={comment} /> : null}
                    <CommentHeader block={comment} admin={menu.adminMenu} toggler={menu.setAdminMenu} />
                    {UserLabel()}
                    {!menu.editing && comment.text ?
                    <Text p='2' fontSize={commentFontSize}>{comment.text}</Text> : null}
                    {menu.editing ? replyForm() : null}
                    <CommentButtons comment={comment} closed={branchClosed()} />
                    {isReplying ?
                        <CommentForm
                            submitLabel="Reply"
                            handleSubmit={(text) => addComment(text, id)}
                        /> : null
                    }
                    {branchClosed() ? (<Center><Text p={2}>discussion closed</Text></Center>) : null}
                </Box>
                {replies && replies.length > 0 && (depth++ || true) ? <CommentReplies replies={replies} refr={refr} depth={depth} /> : null}
            </> : null);
}

export default Comment;
