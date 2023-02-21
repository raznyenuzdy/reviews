import { useState } from "react";
import { Box, Flex, Spacer, Link, Progress, Center } from '@chakra-ui/react';
import Review from './comments/Review';
import ReplyToComment from './dialogs/Reply';
import CancelEditBlockAlert from './dialogs/CancelEditBlockAlert';
import DeleteCommentAlert from './dialogs/DeleteCommentAlert';
import ReplyToBlock from './dialogs/BlockReply';
import Block from "./block/Block";
import { useModelContext } from "../context/model.context";
import { useMenuContext } from "../context/menu.context";
import InfiniteScroll from "react-infinite-scroll-component";
import Config from '../startup/config';
import { getBlocks } from '../db/model';
import inAppEvent from '../startup/events';
import {useGrantsContext} from "../context/auth.context";
import Ad from "./comments/Ad";
import BlockForm from "./block/BlockForm";
import AddBlockForm from "./block/addBlockFiorm";

const Blocks = ({paging}) => {

    const [hasMore, setHasMore] = useState(true);

    const { state } = useModelContext();

    const { menu } = useMenuContext();

    const { boss } = useGrantsContext();

    if (!state?.model) {
        setTimeout(() => {//костыль
            inAppEvent.emit('errorMessage', "Service temporarily not provide information!")
        }, 0)
    }

    const getMorePost = async () => {
        if (!state.scrollable) return;
        const {model} = await getBlocks(state.blocks, undefined, menu.showDeleted);
        if (model) {
            state.blocks += model.length;
            state.setBlocks(state.blocks);
            state.scrollable = true;
            state.setScrollable(state.scrollable);
            state.model = state.model.concat(model);
            state.setModel(state.model);
            if (state.model.length > Config.blocksMaxThreshold)
                setHasMore(false)
        }
    };

    const filter = () => {
        return true
    }

    const draw = state.model?.filter(filter).map((block) => (!block.parentId && (!block.deleted || menu.showDeleted) ?
        <Block
            key={'block' + block.id}
            id={block.id}
        /> : null
    ))

    return (!state?.model ? null :
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
                scrollThreshold={0.4}
                loader={state.scrollable ? <Progress size='xs' isIndeterminate /> : null}
                endMessage={<Center><h4>Nothing more to show</h4></Center>}
            >
                <AddBlockForm />
                { draw }
            </InfiniteScroll>
        </>
    )
}

export default Blocks;
