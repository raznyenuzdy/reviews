import { useEffect, useState, useRef } from "react";
import { Box, Button, ButtonGroup, Input, Textarea, VStack } from '@chakra-ui/react';
import { blockFormButtonFontSize } from '../../startup/theming';
import inter from '../../startup/inter';
import inAppEvent from "../../startup/events";
import { key } from "../../utils/utils";
import { adjustLoadedBlock } from '../../db/model2';

const BlockForm = ({block, grants, setisediting, setblock}) => {

    const [disabled, setDisabled] = useState(false);

    const [text, setText] = useState(block.text);

    const [label, setLabel] = useState(block.label);

    const [once, setOnce] = useState(true);

    const [_key] = useState(key());

    const aref = useRef(null);

    const iref = useRef(null);

    const onSubmit = (event) => {
        event.preventDefault();
        setText("");
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
        setText(e.target.value)
    }

    useEffect(() => {
        const h = inter.get('height');
        if (h && parseInt(h)) {
            aref.current.style.height = (h - 14)+'px';
        }
        if (once) setFocusOnTextArea();
        setOnce(false);
    }, [once]);

    const save = async () => {
        try {
            setDisabled(true);
            grants.token = grants.token ? grants.token : await getAccessTokenSilently();
            const reply = {
                ...block,
                user_model: JSON.stringify(block.user_model),
                type: block.type.type,
                label,
                text,
            };
            const options = {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${grants.token}`,
                    'Content-type': 'application/json',
                    'key': _key
                },
                body: JSON.stringify(reply),
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/block`,
                options
            );
            const responseData = await response.json();
            if (response.status !== 200) {
                inAppEvent.emit('errorEvent', [response.status, responseData]);
            }
            const data = adjustLoadedBlock(responseData);
            setblock(data);
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
        <Box p='0'>
            <form onSubmit={onSubmit}>
                <VStack p='2' align='left'>
                    <Box>
                        <Input disabled={disabled} ref={iref} bg='orange.50' w='100%' value={label} onChange={(e) => setLabel(e.target.value)}/>
                    </Box>
                    <Textarea
                        p='0.2em'
                        m={0}
                        bg='orange.50'
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
                            disabled={block.text.length <= 0}>Save</Button>
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
