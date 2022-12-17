import { useState } from "react";
import { Box, Flex, Link, Spacer, Checkbox, Stack } from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { CloseIcon, ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { linkFontSize } from '../../startup/theming';
import inAppEvent from "../../startup/events";

const BlockAdminPanel = ({ block, toggle, toggler }) => {
    const { grants } = useGrantsContext();
    const { state } = useModelContext();
    const [saved, setSaved] = useState(true);
    const base = { approved: block.approved, closed: block.closed, deleted: block.deleted }
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
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/block/admin/${block.id}`,
            options
        );
        return await response.json();
    }

    const save = async () => {
        fetcher()
            .then(done => {
                setSaved(true);
                setFirstState(done);
                setStateAdmin({ approved: done.approved, closed: done.closed, deleted: done.deleted })
                block.approved = done.approved;
                block.closed = done.closed;
                block.deleted = done.deleted;
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

    const moveUp = async () => {
        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${grants.token}`,
                    'Content-type': 'application/json'
                }
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/block/up/${block.id}`,
                options
            );
            const responseData = await response.json();
            if (response.status !== 200) {
                inAppEvent.emit('errorEvent', [response.status, responseData]);
                return;
            }
            const i1 = state.model.findIndex(m => m.id === responseData.obj1.id);
            const i2 = state.model.findIndex(m => m.id === responseData.obj2.id);
            if (i1 < 0 || i2 < 0) return;
            [state.model[i1], state.model[i2]] = [state.model[i2], state.model[i1]];
            state.model = [...state.model];
            state.setModel(state.model);
        } catch (error) {
            inAppEvent.emit('errorEvent', [500, error]);
        }
    }

    const moveDown = async () => {
        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${grants.token}`,
                    'Content-type': 'application/json'
                }
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/block/down/${block.id}`,
                options
            );
            const responseData = await response.json();
            if (response.status !== 200) {
                inAppEvent.emit('errorEvent', [response.status, responseData]);
                return;
            }
            const i1 = state.model.findIndex(m => m.id === responseData.obj1.id);
            const i2 = state.model.findIndex(m => m.id === responseData.obj2.id);
            if (i1 < 0 || i2 < 0) return;
            [state.model[i1], state.model[i2]] = [state.model[i2], state.model[i1]];
            state.model = [...state.model];
            state.setModel(state.model);
        } catch (error) {
            inAppEvent.emit('errorEvent', [500, error]);
        }
    }


    return (
        isBoss && (toggle === block.id) ?
            <Box p={2}>
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
                    <Stack spacing={5} direction='row'>
                        {!(saved || sameState) ?
                            <>
                                <Link fontSize={linkFontSize} pl='2' color='green.700' onClick={() => save()}>Save</Link>
                                <Link fontSize={linkFontSize} pl='0' color='orange.400' onClick={() => reset()}>Reset</Link>
                            </> : null}
                    </Stack>
                    <Spacer />
                    <Stack spacing={5} direction='row' alignItems='center'>
                        <Stack spacing={2} direction='row' alignItems='center'>
                            <ArrowUpIcon boxSize={6} color='blue.600' onClick={() => moveUp()} />
                            <ArrowDownIcon boxSize={6} color='blue.600' onClick={() => moveDown()} />
                        </Stack>
                        <CloseIcon boxSize={4} color='blue.600' onClick={() => toggler()} />
                    </Stack>
                </Flex>
            </Box> : null);
}

export default BlockAdminPanel;