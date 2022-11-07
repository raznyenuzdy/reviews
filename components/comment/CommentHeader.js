import { Avatar, Box, IconButton, Container, Flex, Link, Skeleton, SkeletonCircle, SkeletonText,
    FormControl, FormLabel, Switch, Checkbox, CheckboxGroup, HStack, Spacer, Stack, Text, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useGrantsContext } from "../../context/auth.context";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useModelContext } from "../../context/model.context";
import { useMenuContext } from "../../context/menu.context";
import { userTypes } from '../../utils/utils';

const CommentHeader = ({block, admin}) => {
    const [ state ] = useModelContext();
    const { model, setModel } = state;
    const { menu, setMenu } = useMenuContext();
    const [comment, setComment] = useState(model.find(b => b.id === block.id));
    const { grants } = useGrantsContext();
    const boss = ['admin', 'moder'].find(v => v === grants?.role);

    const commentHeaderFontSize = ['md','md','xl','xl','xl'];

    const buildName = (user) => {
        const a = [];
        if (['admin', 'moder'].find(v => v === user?.role)) a.push(userTypes[user.role]?.label || '')
        if (user?.firstName) a.push(user?.firstName)
        if (user?.lastName) a.push(user?.lastName)
        if (user?.nickname) a.push(user?.nickname)
        if (user?.email) a.push(user?.email.split('@')[0])
        return a.join(' ');
    }

    const clicker = () => {
        menu.setAdminMenu(menu.adminMenu = menu.adminMenu === comment.id ? null : comment.id);
    }

    const AdminMenuSwt = () => {
        return (
        <FormControl display='flex' alignItems='center'>
            <FormLabel htmlFor='adminMenuSWT' mb='0'>
            </FormLabel>
            <Switch id='adminMenuSWT' isChecked={true} onChange={clicker}/>
        </FormControl>)
    }

    // <Link fontSize='sm' pl='2' onClick={() => clicker()}>admin {admin === comment.id ? 'OFF' : 'ON'}</Link>

    return (
    <Container pl='2' pr='2' pt='2' pb='2' bg='blue.100'>
        <Flex>
            <HStack spacing='2'>
                <Avatar size={['sm','md','lg','lg','md']} bg='teal.500' name={"Y P"} />
                <Stack spacing={0}>
                    <Text fontSize={commentHeaderFontSize}>{buildName(comment.user_model)}</Text>
                </Stack>
            </HStack>
            <Spacer />
            <Center>
            <HStack spacing={0}>
            <Text fontSize={commentHeaderFontSize}>{comment.createdAtStr}</Text>
            {comment.modifiedAtStr ? <Text pl={1} fontSize={commentHeaderFontSize}>(modified {comment.modifiedAtStr})</Text> : null}
            {boss ? <Box pl={2}><Center>{admin !== comment.id ? <HamburgerIcon boxSize={6} color='green.600' onClick={() => clicker()} /> : <CloseIcon boxSize={4} color='blue.600' onClick={() => clicker()} />}</Center></Box> : null}
            </HStack>
            </Center>
        </Flex>
    </Container>)
}

export default CommentHeader;