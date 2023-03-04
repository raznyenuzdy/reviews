import {useState} from "react";
import {Progress, Center} from '@chakra-ui/react';
import Review from './comments/Review';
import ReplyToComment from './dialogs/Reply';
import CancelEditBlockAlert from './dialogs/CancelEditBlockAlert';
import DeleteCommentAlert from './dialogs/DeleteCommentAlert';
import ReplyToBlock from './dialogs/BlockReply';
import Block from "./block/Block";
import {useModelContext} from "../context/model.context";
import {useMenuContext} from "../context/menu.context";
import InfiniteScroll from "react-infinite-scroll-component";
import Config from '../startup/config';
import {getBlocksFrontend} from '../db/model';
import inAppEvent from '../startup/events';
import {useGrantsContext} from "../context/auth.context";
import AddBlockForm from "./block/addBlockFiorm";
import DeleteBlockAlert from "./dialogs/DeleteBlockAlert";
import SignupOrLogin from "./SignupOrLogin";

const Blocks = () => {

    const {grants, boss, userType} = useGrantsContext();
console.log("WTF??", grants);
    const {menu} = useMenuContext();

    const filterHiddenBlocks = m => !(m.deleted && !menu.showDeleted);

    const [hasMore, setHasMore] = useState(true);

    const {state, setState} = useModelContext();

    if (!state?.model) {
        setTimeout(() => {//костыль
            inAppEvent.emit('errorMessage', "Service temporarily not provide information!")
        }, 0)
    }

    const getMorePost = async () => {
        if (!state.scrollable) return;
        const {model} = await getBlocksFrontend(5, state.model[state.model.length - 1].position);
        if (model) {
            setState(prevState => ({
                ...prevState,
                scrollable: true,
                model: [...prevState.model, ...model]
            }));
            if (state.model.filter(filterHiddenBlocks).length + model.filter(filterHiddenBlocks).length > Config.blocksMaxThreshold)
                setHasMore(false)
        }
    };

    const draw = state.model?.filter(filterHiddenBlocks).map((block) => (!block.parentId ?
            <Block key={'block' + block.id} id={block.id}/> : null
    ))
    return (!state?.model ? null :
            <>
                <ReplyToBlock/>
                <ReplyToComment/>
                <CancelEditBlockAlert/>
                <DeleteCommentAlert/>
                <DeleteBlockAlert/>
                <InfiniteScroll
                    dataLength={state.model.length}
                    next={getMorePost}
                    hasMore={hasMore}
                    scrollThreshold={0.8}
                    loader={state.scrollable ? <Progress size='xs' isIndeterminate/> : null}
                    endMessage={<Center><h4>Nothing more to show</h4></Center>}
                >
                    {boss ? <AddBlockForm/> : null}
                    {userType ? <Review submitLabel="Write"/> : null}
                    {!grants ? <SignupOrLogin /> : null}
                    {draw}
                </InfiniteScroll>
            </>
    )
}

export default Blocks;
