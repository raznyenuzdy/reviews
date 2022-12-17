import { useState, useEffect, useRef } from "react";
import { Avatar, Box, Center, Select, Skeleton, SkeletonCircle, SkeletonText, Wrap, NumberInput, NumberDecrementStepper, NumberInputStepper, NumberIncrementStepper, NumberInputField, WrapItem, Badge, Button, Container, Text, VStack, Stack, HStack, Flex, Spacer, Link } from '@chakra-ui/react';
import BlockForm from "./block/BlockForm";
import Review from './comments/Review';
import ReplyToComment from './dialogs/Reply';
import CancelEditBlockAlert from './dialogs/CancelEditBlockAlert';
import DeleteCommentAlert from './dialogs/DeleteCommentAlert';
import ReplyToBlock from './dialogs/BlockReply';
import Block from "./block/Block";
import { useGrantsContext } from "../context/auth.context";
import { useModelContext } from "../context/model.context";
import { useMenuContext } from "../context/menu.context";
import InfiniteScroll from "react-infinite-scroll-component";
import Config from '../startup/config';
import { key, blockType } from '../utils/utils';
import { getBlocks } from '../db/model2';
import { adjustBlock } from '../db/model2';
import inAppEvent from '../startup/events';

const Blocks = () => {
    const [hasMore, setHasMore] = useState(true);
    const { state } = useModelContext();
    const { grants } = useGrantsContext();
    const { menu } = useMenuContext();

    const reOrder = () => {
        // state.model.sort((a, b) => {a.position > b.position});
        // state.model = {...state.model};
    }

    inAppEvent.on('reorder', reOrder);

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
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/block`,
            options
        );
        const responseData = await response.json();
        // const block = adjustBlock(obj, grants)
        model = model.concat(responseData);
        // setModel(model);
    }

    const review = () => {

    }

    const getMorePost = async () => {
        const loaded = await getBlocks(state.page);
        if (loaded) {
            state.setPage(++state.page);
            state.model = state.model.concat(loaded);
            state.setModel(state.model);
            if (state.model.length > Config.blocksMaxThreshold)
                setHasMore(false)
        }
    };

    const filter = () => {

        return true
    }

    return (
        <>
            <Review submitLabel="Write" />
            <ReplyToBlock />
            <ReplyToComment />
            <CancelEditBlockAlert />
            <DeleteCommentAlert />
            <InfiniteScroll
                dataLength={state.model.length}
                next={getMorePost}
                hasMore={hasMore}
                loader={<h3>Loading...</h3>}
                endMessage={<h4>Nothing more to show</h4>}
            >
                {state.model.filter(filter).map((block) => (!block.parentId && (!block.deleted || menu.showDeleted) ?
                    <Block
                        key={'block' + block.id}
                        id={block.id}
                        // block={block}
                    /> : null
                ))}
                <Flex direction='row'>
                    <Link>Prev</Link><Spacer/><Box>Page {state.page}</Box><Spacer/><Link>Next</Link>
                </Flex>
            </InfiniteScroll>
        </>
    )
}

export default Blocks;