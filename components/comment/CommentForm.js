import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Textarea, VStack } from '@chakra-ui/react';
import { useModelContext } from "../../context/model.context";

const CommentForm = ({ comment,
    handleSubmit,
    submitLabel,
    handleCancel
}) => {
    const { model, modelLoading } = useModelContext();
    // const { grants, setGrants } = useGrantsContext();

    const [m, sM] = useState(model);
    // const [g, sG] = useState(grants);

    const onSubmit = (event) => {
        event.preventDefault();
        // handleSubmit(text, model, grants);
        setText("");
    };

    return (
        <Box p='0'>
            <form onSubmit={onSubmit}>
                <VStack p='2' align='left'>
                    <Textarea
                        p='0.2em'
                        m={0}
                        bg='orange.50'
                        size='sm'
                        className="comment-form-textarea"
                        value={comment.text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <ButtonGroup variant='outline' spacing='6'>
                        <Button
                            colorScheme='blue'
                            size='sm'
                            type='submit'
                            disabled={comment.text.length <= 0}>Save</Button>
                        <Button
                            colorScheme='orange'
                            size='sm'
                            onClick={handleCancel}>Cancel</Button>
                    </ButtonGroup>
                </VStack>
            </form>
        </Box>
    );
};

export default CommentForm;
