import { useState } from "react";
import { Box, Flex, Link, Spacer, Checkbox, Stack } from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { CloseIcon } from '@chakra-ui/icons';

const CommentAdminPanel = ({ comment, toggle, toggler, callback }) => {

    const { grants } = useGrantsContext();

    const { state } = useModelContext();

    const [saved, setSaved] = useState(true);

    const base = { approved: comment.approved, closed: comment.closed, deleted: comment.deleted }

    const [stateAdmin, setStateAdmin] = useState(base);

    const [firstState, setFirstState] = useState(stateAdmin);

    const isBoss = ['admin', 'moder'].find(v => v === grants?.role);

    const sameState = firstState.approved === stateAdmin.approved && firstState.closed === stateAdmin.closed && firstState.deleted === stateAdmin.deleted;

    const fetcher = async () => {
        const options = {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${grants.token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(stateAdmin),
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/comment/admin/${comment.id}`,
            options
        );
        return await response.json();
    }

    const closeDiscussionsBelowComment = (cmt = comment) => {
        state.model.find(b => b.id === cmt.ref_block).comments.forEach(c => {
            if (c.ref_parent === cmt.id) {
                c.closed = comment.closed;
                closeDiscussionsBelowComment(c);
            }
        })
    }

    const save = async () => {
        fetcher()
            .then(done => {
                setSaved(true);
                setFirstState(done);
                setStateAdmin({ approved: done.approved, closed: done.closed, deleted: done.deleted })
                comment.approved = done.approved;
                comment.closed = done.closed;
                comment.deleted = done.deleted;
                closeDiscussionsBelowComment(comment);
                callback(comment.closed);
                toggler();
            })
            .catch();
    }

    const reset = () => {
        setStateAdmin(firstState)
    }

    const reState = (e) => {
        setSaved(false);
        setStateAdmin({ ...stateAdmin, [e.target.id]: e.target.checked });
    }

    return (
        (isBoss && toggle === comment.id) ?
            <Box p={2} borderBottom={'1px solid'} borderBottomColor='gray.200' bg='white'>
                <Flex alignItems='center'>
                    <Stack spacing={5} direction='row'>
                        <Checkbox colorScheme='green' id='approved' isChecked={stateAdmin?.approved} onChange={e => reState(e)}>
                            Approved
                        </Checkbox>
                        <Checkbox colorScheme='orange' id='closed' isChecked={stateAdmin?.closed} onChange={e => reState(e)}>
                            closed
                        </Checkbox>
                        <Checkbox colorScheme='red' id='deleted' isChecked={stateAdmin?.deleted} onChange={e => reState(e)}>
                            deleted
                        </Checkbox>
                    </Stack>
                    <Spacer />
                    <Stack spacing={5} direction='row' pr={5}>
                        {!(saved || sameState) ?
                            <>
                                <Link fontSize='sm' pl='2' color='green.700' onClick={() => save()}>Save</Link>
                                <Link fontSize='sm' pl='0' color='orange.400' onClick={() => reset()}>Reset</Link>
                            </> : null}
                    </Stack>
                    <CloseIcon boxSize={4} color='blue.600' onClick={toggler} />
                </Flex>
            </Box> : null);
}

export default CommentAdminPanel;