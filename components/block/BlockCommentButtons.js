import { AccordionButton, Button, Flex, Spacer, Box, HStack } from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useMenuContext } from "../../context/menu.context";
import {invertColor, stillActual} from "../../utils/utils";
import { ChatIcon } from '@chakra-ui/icons'
import { blockButtonFontSize } from '../../startup/theming';
import inAppEvent from '../../startup/events';
import inter from '../../startup/inter';

const BlockCommentButtons = ({
    block,
    closed,
    getheight,
    opened,
    isediting,
    setisediting,
    canedit
}) => {

    const { grants, boss } = useGrantsContext();

    const { menu } = useMenuContext();

    const youCanDelete = boss || !block.deleted && !block.closed && block.ref_user === grants?.id && stillActual(block);

    const editor = () => {
        inter.set('height' + block.id, getheight);
        !boss ? menu.reviewForm.isOpen ? menu.reviewForm.onClose() : menu.reviewForm.onOpen() :
        setisediting(true);
    }

    const openDialog = () => {
        inAppEvent.emit('replyOnBlock', block);
    }

    const color1 = opened.length > 0 || block.comments.length === 0 ? invertColor('gray.600') : invertColor('teal.600');

    return (
        <Flex p='0' pr='2' h='2.5rem' direction='row' w='100%' bg={invertColor('gray.200')} _p={[2, 2, 3, 3, 3]} fontSize={blockButtonFontSize}>
            {block.comments.length > 0 ?
                <AccordionButton w='auto'>
                    <Flex justifyContent={'center'} alignItems={'center'} color={opened.length > 0 || block.comments.length === 0 ? '#bbb' : 'teal'}>
                        <ChatIcon w={'1.5rem'} h={'1.5rem'} pr='2' />
                        <Box color={color1}>{block.comments.length}</Box>
                    </Flex>
                </AccordionButton> : null}
            <Spacer />
            {isediting ? null :
                <HStack>
                    {!closed ? (
                        <Button
                            colorScheme='teal'
                            variant='link'
                            onClick={openDialog}>
                            Reply
                        </Button>
                    ) : null}
                    {canedit ? (
                        <>
                            <Spacer />
                            <Button
                                colorScheme='blue'
                                variant='link'
                                onClick={editor}>
                                Edit
                            </Button>
                        </>
                    ) : null}
                    {youCanDelete ? (
                        <>
                            <Spacer />
                            <Button
                                colorScheme='red'
                                variant='link'
                                onClick={() => deleteComment(id)}>
                                Delete
                            </Button>
                        </>
                    ) : null}
                </HStack>
            }
        </Flex>
    )
}

export default BlockCommentButtons;
