import { useState } from "react";
import { Box, Flex, Spacer, Link } from '@chakra-ui/react';
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

const Blocks = () => {

    const [hasMore, setHasMore] = useState(true);

    const { state } = useModelContext();

    const { menu } = useMenuContext();

    if (!state?.model) {
        setTimeout(() => {//костыль
            inAppEvent.emit('errorMessage', "Service temporarily not provide information..")
        }, 0)
    }

    const filter = () => {
        return true
    }

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
                loader={<h3>Loading...</h3>}
                endMessage={<h4>Nothing more to show</h4>}
            >
                {state.model.filter(filter).map((block) => (!block.parentId && (!block.deleted || menu.showDeleted) ?
                    <Block
                        key={'block' + block.id}
                        id={block.id}
                    /> : null
                ))}
                <Flex direction='row'>
                    <Link>Prev</Link><Spacer /><Box>Page {state.page}</Box><Spacer /><Link>Next</Link>
                </Flex>
            </InfiniteScroll>
        </>
    )
}

export default Blocks;
