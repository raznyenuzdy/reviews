import {useState} from "react";
import {Box, Flex, Link, Spacer, Checkbox, Stack, Tooltip, IconButton} from '@chakra-ui/react';
import {useGrantsContext} from "../../context/auth.context";
import {useModelContext} from "../../context/model.context";
import {CloseIcon} from '@chakra-ui/icons';
import inAppEvent from "../../startup/events";
import {httpApi} from "../../utils/http";
import {invertColor} from "../../utils/utils";
import {linkFontSize, checkbox1} from "../../startup/theming";

const CommentAdminPanel = ({comment, toggle, toggler, callback}) => {

    const {grants, boss} = useGrantsContext();

    const [saved, setSaved] = useState(true);

    const base = {approved: comment?.approved, closed: comment?.closed, deleted: comment?.deleted}

    const [stateAdmin, setStateAdmin] = useState(base);

    const [firstState, setFirstState] = useState(stateAdmin);

    const sameState = firstState?.approved === stateAdmin?.approved && firstState?.closed === stateAdmin?.closed && firstState?.deleted === stateAdmin?.deleted;

    const save = async () => {
        try {
            const resp = await httpApi('PATCH', `/api/comment/admin/${comment.id}`, null, stateAdmin);
            if (!resp) return;
            const response = resp.responseData;
            setSaved(true);
            setFirstState(response);
            setStateAdmin({approved: response.approved, closed: response.closed, deleted: response.deleted})
            comment.approved = response.approved;
            comment.closed = response.closed;
            comment.deleted = response.deleted;
            callback(stateAdmin);
            toggler();
        } catch (error) {
            console.log("Error:", error);
            inAppEvent.emit('errorEvent', [500, error]);
        }
    }

    const reset = () => {
        setStateAdmin(firstState)
    }

    const reState = (e) => {
        setSaved(false);
        setStateAdmin({...stateAdmin, [e.target.id]: e.target.checked});
    }

    return (
        (boss && toggle === comment.id) ?
            <Box p={2} borderBottom={'1px solid'} borderBottomColor={invertColor('gray.300')}
                 bg={invertColor('gray.200')}>
                <Flex alignItems='center'>
                    <Stack spacing={5} direction='row'>
                        <Tooltip openDelay={500} hasArrow
                                 label='Users will see just approved comments, not approved see just author.'>
                            <Checkbox variant='checkbox2' colorScheme='green' id='approved' isChecked={stateAdmin?.approved}
                                      onChange={e => reState(e)}>
                                Approved
                            </Checkbox>
                        </Tooltip>
                        <Tooltip openDelay={500} hasArrow
                                 label="No new replies to this reply possible.">
                            <Checkbox variant='checkbox2' colorScheme='orange' id='closed' isChecked={stateAdmin?.closed}
                                      onChange={e => reState(e)}>
                                closed
                            </Checkbox>
                        </Tooltip>
                        <Tooltip openDelay={500} hasArrow
                                 label="Users will not see deleted replies.">
                            <Checkbox variant='checkbox2' colorScheme='red' id='deleted' isChecked={stateAdmin?.deleted}
                                      onChange={e => reState(e)}>
                                deleted
                            </Checkbox>
                        </Tooltip>
                    </Stack>
                    <Spacer/>
                    <Stack spacing={5} direction='row'>
                        {!(saved || sameState) ?
                            <>
                                <Tooltip openDelay={500} hasArrow label="Save your selections.">
                                    <Link fontSize={linkFontSize} pl='2' color={invertColor('green.600')} onClick={() => save()}>Save</Link>
                                </Tooltip>
                                <Tooltip openDelay={500} hasArrow label="Revert all selections back.">
                                    <Link fontSize={linkFontSize} pl='0' color={invertColor('orange.500')} onClick={() => reset()}>Reset</Link>
                                </Tooltip>
                            </> : null}
                    </Stack>
                    <Spacer/>
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
                </Flex>
            </Box> : null);
}

export default CommentAdminPanel;
