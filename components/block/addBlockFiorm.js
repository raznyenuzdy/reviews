import {useEffect, useState, useRef} from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Flex,
    Input, Spacer,
    Stack,
    Textarea,
    Tooltip,
    VStack
} from '@chakra-ui/react';
import {blockFontSize, blockFormButtonFontSize} from '../../startup/theming';
import inAppEvent from "../../startup/events";
import {invertColor, key} from "../../utils/utils";
import {adjustLoadedBlock} from '../../db/model';
import {httpApi} from "../../utils/http";
import {useMenuContext} from "../../context/menu.context";
import {useModelContext} from "../../context/model.context";

const AddBlockForm = () => {

    const {adForm, setAdForm} = useMenuContext();

    const { addBlock } = useModelContext();

    const [disabled, setDisabled] = useState(false);

    const [text, setText] = useState('');

    const [label, setLabel] = useState('');

    const [approved, setApproved] = useState('checked');

    const [closed, setClosed] = useState('');

    const [deleted, setDeleted] = useState('');

    const [once, setOnce] = useState(true);

    const [touched, setTouched] = useState(false);

    const [_key] = useState(key());

    const aref = useRef(null);

    const iref = useRef(null);

    const onSubmit = (event) => {
        event.preventDefault();
        setText("");
        setLabel("");
    };

    const handleCancel = () => {
        setDisabled(true);
        inAppEvent.emit('cancelEditBlock', {});
    }

    const setFocusOnTextArea = () => {
        aref.current.focus();
    }

    const unFreez = () => {
        setDisabled(false);
        setFocusOnTextArea();
    }

    const handleTextChange = (e) => {
        setTouched(true);
        setText(e.target.value)
    }

    const handleLabelChange = (e) => {
        setTouched(true);
        setLabel(e.target.value);
    }

    const disableSave = text.length <= 0 || !touched;

    const save = async () => {
        try {
            setDisabled(true);
            const body = {
                approved: !!approved,
                closed: !!closed,
                deleted: !!deleted,
                label,
                text,
            };
            const headers = {'key': _key};
            const response = await httpApi('POST', '/api/block', headers, body);
            if (response) {
                if (response.status !== 201) {
                    inAppEvent.emit('errorEvent', [response.status, response.responseData]);
                }
                if (response.status === 201) {
                    const block = adjustLoadedBlock(response.responseData);
                    addBlock(block);
                }
            }
            setAdForm(false);
        } catch (error) {
            inAppEvent.emit('errorEvent', [500, error]);
        }
    }

    inAppEvent.clear('focusToBlockTextarea');

    inAppEvent.on('focusToBlockTextarea', unFreez);

    inAppEvent.clear('closeBlockTextarea');

    inAppEvent.on('closeBlockTextarea', () => setAdForm(false));

    useEffect(() => {
        if (adForm) {
            setDisabled(false);
            aref.current.style.height = '10rem';
            if (once) setFocusOnTextArea();
            setOnce(false);
        }
    }, [once, adForm]);

    return (
        !adForm ?
            <Flex direction='row' alignItems='center' m={['3']}>
                <Box>Have something to write?</Box>
                <Spacer />
                <Button colorScheme='blue' size={['lg', 'md']} fontSize={['xl', 'xl', 'xl', 'xl', 'lg']} onClick={() => setAdForm(true)}>Publish Article as Superuser</Button>
            </Flex> :
            <form onSubmit={onSubmit}>
                <Box p={2} borderBottomColor={invertColor('gray.300')} bg={invertColor('gray.300')}>
                    <Flex alignItems='center'>
                        <Stack spacing={5} direction='row'>
                            <Tooltip openDelay={500} hasArrow
                                     label='Users will see just approved blocks, not approved see just author.'>
                                <Checkbox variant='checkbox1' colorScheme='green' id='approved' isChecked={approved}
                                          onChange={e => setApproved(e.target.checked)}>
                                    Approved
                                </Checkbox>
                            </Tooltip>
                            <Tooltip openDelay={500} hasArrow
                                     label="No new replies to this block possible, comments still can get new replies.">
                                <Checkbox variant='checkbox1' colorScheme='orange' id='closed' isChecked={closed}
                                          onChange={e => setClosed(e.target.checked)}>
                                    closed
                                </Checkbox>
                            </Tooltip>
                            <Tooltip openDelay={500} hasArrow
                                     label="Users will not see deleted blocks. To see deleted for you, allow it at menu.">
                                <Checkbox variant='checkbox1' colorScheme='red' id='deleted' isChecked={deleted}
                                          onChange={e => setDeleted(e.target.checked)}>
                                    deleted
                                </Checkbox>
                            </Tooltip>
                        </Stack>
                    </Flex>
                </Box>
                <Box mb='0' bg={invertColor('gray.50')} w='100%' border='1px' borderColor={invertColor('gray.300')}
                     fontSize={blockFontSize}>
                    <VStack p='2' align='left' w='100%'>
                        <Box>
                            <Input
                                disabled={disabled}
                                ref={iref}
                                bg={() => invertColor('orange.50')}
                                w='100%'
                                onChange={handleLabelChange}/>
                        </Box>
                        <Textarea
                            p='0.2em'
                            m={0}
                            bg={() => invertColor('orange.50')}
                            disabled={disabled}
                            ref={aref}
                            fontSize='md'
                            className="comment-form-textarea"
                            onChange={handleTextChange}
                        />
                        <ButtonGroup variant='outline' spacing='6'>
                            <Button
                                colorScheme='blue'
                                size={blockFormButtonFontSize}
                                type='submit'
                                onClick={save}
                                disabled={disableSave}>Save</Button>
                            <Button
                                colorScheme='orange'
                                size={blockFormButtonFontSize}
                                onClick={handleCancel}>Cancel</Button>
                        </ButtonGroup>
                    </VStack>
                </Box>
            </form>
    );
};

export default AddBlockForm;
