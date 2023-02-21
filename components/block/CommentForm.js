import { useEffect, useState, useRef } from "react";
import { Box, Button, ButtonGroup, Input, Textarea, VStack } from '@chakra-ui/react';
import { blockFormButtonFontSize } from '../../startup/theming';
import inter from '../../startup/inter';
import inAppEvent from "../../startup/events";
import { key } from "../../utils/utils";
import { adjustLoadedBlock } from '../../db/model';
import { httpApi } from "../../utils/http";

const CommentForm = ({ setisediting, comment, setcomment }) => {

    const [disabled, setDisabled] = useState(false);

    const [text, setText] = useState(comment.text);

    const [once, setOnce] = useState(true);

    const [touched, setTouched] = useState(false);

    const [_key] = useState(key());

    const aref = useRef(null);

    const onSubmit = (event) => {
        event.preventDefault();
        setText("");
    };

    const handleCancel = () => {
        setDisabled(true);
        inAppEvent.emit('cancelEditComment', {});
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

    const disableSave = comment.text.length <= 0 || !touched || comment.text === text;

    useEffect(() => {
        const h = inter.get('heightc' + comment.id);
        if (h && parseInt(h)) {
            aref.current.style.height = (h - 14) + 'px';
        }
        if (once) setFocusOnTextArea();
        setOnce(false);
    }, [once, comment]);

    const save = async () => {
        try {
            setDisabled(true);
            const body = {
                ...comment,
                text,
            };
            const headers = { 'key': _key };
            const response = await httpApi('PUT', '/api/comment', headers, body);
            if (response) {
                if (response.status !== 200) {
                    inAppEvent.emit('errorEvent', [response.status, response.responseData]);
                }
                const data = adjustLoadedBlock(response.responseData);
                if (data) setcomment(data);
            }
            setisediting(false);
        } catch (error) {
            inAppEvent.emit('errorEvent', [500, error]);
        }
    }

    inAppEvent.clear('focusToCommentTextarea');

    inAppEvent.on('focusToCommentTextarea', unFreez);

    inAppEvent.clear('closeCommentTextarea');

    inAppEvent.on('closeCommentTextarea', () => setisediting(false));

    return (
        <Box p='0' w='100%'>
            <form onSubmit={onSubmit}>
                <VStack p='2' align='left' w='100%'>
                    <Textarea
                        p='0.2em'
                        m={0}
                        bg='orange.50'
                        disabled={disabled}
                        w='100%'
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

export default CommentForm;
