import { useState } from "react";
import {Box, Flex, Link, Spacer, Checkbox, Stack, Tooltip, IconButton} from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import {CloseIcon, ArrowDownIcon, ArrowUpIcon, HamburgerIcon} from '@chakra-ui/icons';
import { linkFontSize } from '../../startup/theming';
import inAppEvent from "../../startup/events";
import { httpApi } from "../../utils/http";
import {invertColor} from "../../utils/utils";
import {useUser} from "@auth0/nextjs-auth0/client";

const BlockAdminPanel = ({ block, toggle, toggler, admincallback }) => {

    const { boss } = useGrantsContext();

    const { state } = useModelContext();

    const [saved, setSaved] = useState(true);

    const base = { approved: block?.approved, closed: block?.closed, deleted: block?.deleted }

    const [stateAdmin, setStateAdmin] = useState(base);

    const [firstState, setFirstState] = useState(stateAdmin);

    const sameState = firstState.approved === stateAdmin?.approved && firstState?.closed === stateAdmin?.closed && firstState?.deleted === stateAdmin?.deleted;

    const save = async () => {
        try {
            const resp = await httpApi('PATCH', `/api/block/admin/${block.id}`, null, stateAdmin);
            if (!resp) return;
            const response = resp.responseData;
            setSaved(true);
            setFirstState(response);
            setStateAdmin({ approved: response.approved, closed: response.closed, deleted: response.deleted })
            block.approved = response.approved;
            block.closed = response.closed;
            block.deleted = response.deleted;
            // state.model = [...state.model];
            // state.setModel(state.model);
            admincallback(stateAdmin);
            toggler();
        } catch (error) {
            inAppEvent.emit('errorEvent', [500, error]);
        }
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
            const response = await httpApi('PATCH', `/api/block/up/${block.id}`);
            if (!response) return;
            if (response.status !== 200) {
                inAppEvent.emit('errorEvent', [response.status, response.responseData]);
                return;
            }
            const i1 = state.model.findIndex(m => m.id === response.responseData.obj1.id);
            const i2 = state.model.findIndex(m => m.id === response.responseData.obj2.id);
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
            const response = await httpApi('PATCH', `/api/block/down/${block.id}`);
            if (!response) return;
            if (response.status !== 200) {
                inAppEvent.emit('errorEvent', [response.status, response.responseData]);
                return;
            }
            const i1 = state.model.findIndex(m => m.id === response.responseData.obj1.id);
            const i2 = state.model.findIndex(m => m.id === response.responseData.obj2.id);
            if (i1 < 0 || i2 < 0) return;
            [state.model[i1], state.model[i2]] = [state.model[i2], state.model[i1]];
            state.model = [...state.model];
            state.setModel(state.model);
        } catch (error) {
            inAppEvent.emit('errorEvent', [500, error]);
        }
    }

    return (
        (boss && toggle === block.id) ?
            <Box p={2} borderBottomColor={invertColor('gray.300')} bg={invertColor('gray.300')}>
                <Flex alignItems='center'>
                    <Stack spacing={5} direction='row'>
                        <Checkbox variant='checkbox1' colorScheme='green' id='approved' isChecked={stateAdmin?.approved} onChange={e => reState(e)}>
                            <Tooltip label='Users will see just approved blocks, not approved see just author.'>
                            Approved
                            </Tooltip>
                        </Checkbox>
                        <Checkbox variant='checkbox1' colorScheme='orange' id='closed' isChecked={stateAdmin?.closed} onChange={e => reState(e)}>
                            <Tooltip label="No new replies to this block possible, comments still can get new replies.">
                            closed
                            </Tooltip>
                        </Checkbox>
                        <Checkbox variant='checkbox1' colorScheme='red' id='deleted' isChecked={stateAdmin?.deleted} onChange={e => reState(e)}>
                            <Tooltip label="Users will not see deleted blocks. To see deleted for you, allow it at menu.">
                            deleted
                            </Tooltip>
                        </Checkbox>
                    </Stack>
                    <Spacer />
                    <Stack spacing={5} direction='row'>
                        {!(saved || sameState) ?
                            <>
                                <Tooltip openDelay={500} hasArrow label="Save your selections.">
                                <Link fontSize={linkFontSize} pl='2' color={invertColor('green.600')} onClick={() => save()}>Save</Link>
                                </Tooltip>
                                <Tooltip openDelay={500} hasArrow label="Revert all selections back.">
                                <Link fontSize={linkFontSize} pl='0' color={invertColor('orange.400')} onClick={() => reset()}>Reset</Link>
                                </Tooltip>
                            </> : null}
                    </Stack>
                    <Spacer />
                    <Stack spacing={5} direction='row' alignItems='center'>
                        <Stack spacing={2} direction='row' alignItems='center'>
                            <Tooltip openDelay={500} label='Move this block up'>
                                <IconButton
                                    size={'xl'}
                                    color={invertColor('blue.600')}
                                    fontSize='2xl'
                                    variant="linkIcon"
                                    onClick={() => moveUp()}
                                    icon={<ArrowUpIcon aria-label={'move block up'}/>}
                                    aria-label={'Open Menu'}
                                />
                            </Tooltip>
                            <Tooltip openDelay={500} label='Move this block down'>
                                <IconButton
                                    size={'xl'}
                                    color={invertColor('blue.600')}
                                    fontSize='2xl'
                                    variant="linkIcon"
                                    onClick={() => moveDown()}
                                    icon={<ArrowDownIcon aria-label={'move block down'}/>}
                                    aria-label={'Open Menu'}
                                />
                            </Tooltip>
                        </Stack>
                        <Tooltip openDelay={500} label='Close this admin panel'>
                            <IconButton
                                size={'xl'}
                                color={invertColor('blue.600')}
                                fontSize='md'
                                variant="linkIcon"
                                onClick={() => toggler()}
                                icon={<CloseIcon aria-label={'move block down'}/>}
                                aria-label={'Open Menu'}
                            />
                        </Tooltip>
                    </Stack>
                </Flex>
            </Box> : null);
}

export default BlockAdminPanel;
