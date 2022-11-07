import { useState, useEffect } from "react";
import { Box, Flex, FormControl, Link, Skeleton, Spacer, SkeletonCircle, SkeletonText, Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useMenuContext } from "../../context/menu.context";
import { useModelContext } from "../../context/model.context";

const AdminPanel = ({ block }) => {
    const { grants } = useGrantsContext();
    const [state] = useModelContext();
    const {menu} = useMenuContext();
    const comment = state.model.find(b => b.id === block.id);
    const [saved, setSaved] = useState(true);
    const base = { approved: comment.approved, closed: comment.closed, deleted: comment.deleted }
    const [stateAdmin, setStateAdmin] = useState(base);
    const [firstState, setFirstState] = useState(stateAdmin);
    const isBoss = ['admin', 'moder'].find(v => v === grants?.role);
    const sameState = firstState.approved === stateAdmin.approved && firstState.closed === stateAdmin.closed && firstState.deleted === stateAdmin.deleted;

    const fetcher = async () => {
        console.log("SAVE:", stateAdmin);
        const options = {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${grants.token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(stateAdmin),
        }
        const response = await fetch(
            `http://localhost:5000/api/block/admin/${comment.id}`,
            options
        );
        if (!response.ok) {
            console.log(response);
        }
        return await response.json();
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
                state.model = [...state.model];
                state.setModel(state.model);
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
        isBoss && menu.adminMenu === comment.id ?
            <Box>
                <Flex>
                    <Stack spacing={5} direction='row' p={2}>
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
                    <Stack spacing={5} direction='row' p={2}>
                        {!(saved || sameState) ?
                            <>
                                <Link fontSize='sm' pl='2' color='green.700' onClick={() => save()}>Save</Link>
                                <Link fontSize='sm' pl='0' color='orange.400' onClick={() => reset()}>Reset</Link>
                            </> : null}
                    </Stack>
                </Flex>
            </Box> : null);
}

export default AdminPanel;