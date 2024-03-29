import { useEffect, useState, useRef } from "react";
import { Box, Button, ButtonGroup, Input, Textarea, VStack } from '@chakra-ui/react';
import { blockFormButtonFontSize } from '../../startup/theming';
import inter from '../../startup/inter';
import inAppEvent from "../../startup/events";
import {invertColor, key} from "../../utils/utils";
import { adjustLoadedBlock } from '../../db/model';
import { httpApi } from "../../utils/http";

const BlockForm = ({ block, setisediting, setblock }) => {

    const [disabled, setDisabled] = useState(false);

    const [text, setText] = useState(block.text);

    const [label, setLabel] = useState(block.label);

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

    const disableSave = block.text.length <= 0 || !touched || (block.text === text && block.label === label);

    useEffect(() => {
        const h = inter.get('height' + block.id);
        if (h && parseInt(h)) {
            aref.current.style.height = (h - 14) + 'px';
        }
        if (once) setFocusOnTextArea();
        setOnce(false);
    }, [once, block]);

    const save = async () => {
        try {
            setDisabled(true);
            const body = {
                ...block,
                type: block.type.type,
                label,
                text,
            };
            console.log("UPDATE:", body);
            const headers = { 'key': _key };
            const response = await httpApi('PUT', '/api/block', headers, body);
            if (response) {
                if (response.status !== 200) {
                    inAppEvent.emit('errorEvent', [response.status, response.responseData]);
                }
                const data = adjustLoadedBlock(response.responseData);
                setblock(data);
            }
            setisediting(false);
        } catch (error) {
            inAppEvent.emit('errorEvent', [500, error]);
        }
    }

    inAppEvent.clear('focusToBlockTextarea');

    inAppEvent.on('focusToBlockTextarea', unFreez);

    inAppEvent.clear('closeBlockTextarea');

    inAppEvent.on('closeBlockTextarea', () => setisediting(false));

    return (
        <Box p='0' w='100%'>
            <form onSubmit={onSubmit}>
                <VStack p='2' align='left' w='100%'>
                    <Box>
                        <Input
                            disabled={disabled}
                            ref={iref}
                            bg={() => invertColor('orange.50')}
                            w='100%'
                            value={label}
                            onChange={handleLabelChange} />
                    </Box>
                    <Textarea
                        p='0.2em'
                        m={0}
                        bg={() => invertColor('orange.50')}
                        disabled={disabled}
                        ref={aref}
                        fontSize='md'
                        className="comment-form-textarea"
                        value={text}
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
            </form>
        </Box>
    );
};

export default BlockForm;
