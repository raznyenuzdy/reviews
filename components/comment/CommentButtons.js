import { Stack, Button, Flex, Spacer } from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useMenuContext } from "../../context/menu.context";
import { stillActual } from ".././../utils/utils";

const CommentsButtons = ({ comment, closed }) => {

    const { grants } = useGrantsContext();
    const { menu } = useMenuContext();
    const boss = ['admin', 'moder'].find(v => v === grants?.role);
    const youCanEdit = boss || !comment.deleted && !comment.closed && comment.ref_user === grants?.id && stillActual(comment.modifiedAt || comment.createdAt);
    const youCanDelete = boss || !comment.deleted && !comment.closed && comment.ref_user === grants?.id && stillActual(comment.modifiedAt || comment.createdAt);;

    const blockButtonFontSize = ['md','md','lg','xl','lg'];

    const editor = () => {
        //menu.setEditing(menu.editing = comment.id); //чертова мутация. мутировать надо и свойство и контекст
        console.log("EEEEEE:", menu.reviewForm);
        menu.reviewForm.isOpen ? menu.reviewForm.onClose() : menu.reviewForm.onOpen();
        // menu.reviewForm.isOpen();
    }

    return (
        <Flex direction='row' w='100%' bg='gray.200' p={[2,2,3,3,3]}>
            {!closed ? (
                <Button
                    colorScheme='teal'
                    variant='link'
                    fontSize={blockButtonFontSize}
                    onClick={() => setActiveComment({ id: id, type: "replying" })}>
                    Reply
                </Button>
            ) : null}
            <Spacer />
            {menu.editing !== comment.id ? (
                <Button
                    colorScheme='blue'
                    variant='link'
                    fontSize={blockButtonFontSize}
                    onClick={editor}>
                    Edit
                </Button>
            ) : null}
            {youCanDelete ? (
                <>
                <Spacer />
                <Button 
                    colorScheme='red'
                    variant='link'
                    fontSize={blockButtonFontSize}
                    onClick={() => deleteComment(id)}>
                    Delete
                </Button>
                </>
            ) : null}
        </Flex>
    )
}

export default CommentsButtons;