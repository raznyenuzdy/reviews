import { Box } from '@chakra-ui/react';
import Config from '../../startup/config';
import { key } from '../../utils/utils';
import Comment from './Comment';

const commentReplies = ({replies, refr, depth}) => (
    <Box pl={depth <= Config.commentsDepth ? 5 : 0}>
        {replies.map(comment => (
            <Comment id={comment.id} key={key()} block={comment} refresh={refr} depth={depth} />
        ))}
    </Box>
)

export default commentReplies;