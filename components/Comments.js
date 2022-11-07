import { useState, useEffect, useRef } from "react";
import { Avatar, Box, Center, Select, Skeleton, SkeletonCircle, SkeletonText, Wrap, NumberInput, NumberDecrementStepper, NumberInputStepper, NumberIncrementStepper, NumberInputField, WrapItem, Badge, Button, Container, Text, VStack, Stack, HStack, Flex, Spacer } from '@chakra-ui/react';
import CommentForm from "./comment/CommentForm";
import Review from './comments/Review';
import Comment from "./comment/Comment";
import { useGrantsContext } from "../context/auth.context";
import { useModelContext } from "../context/model.context";
import { useMenuContext } from "../context/menu.context";
import Config from '../startup/config';
import { key, blockType } from '../utils/utils';
import { adjustBlock } from '../db/model2';


const Comments = () => {
    // const { model, adminMenu, setModel } = useModelContext();
    const [state, setState] = useModelContext();
    const { grants, setGrants } = useGrantsContext();
    const { menu } = useMenuContext();
    // const { busy, isLoading, modelLoading, grantsLoading } = useBusyContext();
    // const addComment = (comment, label, model, grants) => {
    //     const obj = {
    //         id: key(),
    //         ref_parent: comment.id,
    //         ref_user: grants.ref_user,
    //         ref_page: 0,
    //         type: blockType[grants.role],
    //         label: grants.role === 'user' ? null : label,
    //         text: comment,
    //         createdAt: new Date().toISOString(),
    //         modifiedAt: null,
    //     }
    //     const block = adjustBlock(obj, grants)
    //     model = model.concat(block);
    //     setModel(model);
    // }

    const saveBlock = async () => {
        grants.token = grants.token ? grants.token : await getAccessTokenSilently();
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${grants.token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ title: 'Fetch POST Request Example' }),
        }
        const response = await fetch(
            `http://localhost:5000/api/block`,
            options
        );
        const responseData = await response.json();
        // const block = adjustBlock(obj, grants)
        model = model.concat(responseData);
        setModel(model);
    }

    const review = () => {

    }

    return (
        <Box overflow={'hidden'}>
            <Review submitLabel="Write" />
            {state.model.map((comment) => (!comment.parentId && (!comment.deleted || menu.showDeleted) ?
                <Comment
                    key={key()}
                    id={comment.id}
                    comment={comment}
                    depth={0}
                /> : null
            ))}
        </Box>
    )
}

export default Comments;