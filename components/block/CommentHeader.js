import {
    Avatar, Box, VStack, Flex, HStack, Spacer, Stack, Text, Center
} from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { useGrantsContext } from "../../context/auth.context";
import { buildName, applyHumanTime } from '../../utils/utils';
import CommentAdminPanel from './CommentAdminPanel';
import { SettingsIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { commentAuthorFontSize, avatarBlockHeader, blockTimerFontSize } from '../../startup/theming';
import Config from '../../startup/config';

const CommentHeader = ({ children, comment, isreply, admincallback }) => {

    const [oncer, setOncer] = useState(true)

    const [timerVar, setTimeVar] = useState(null);

    const [created, setCreated] = useState('');

    const [updated, setUpdated] = useState('');

    const { grants, boss } = useGrantsContext();

    const nameString = comment ? buildName(comment.user_model) : buildName(grants);

    const [adminToggle, setAdminToggle] = useState(null);

    const retimer = useCallback(() => {
        if (comment) {
            setUpdated(applyHumanTime(comment.updatedAt));
            setCreated(applyHumanTime(comment.createdAt));
        }
    }, [comment])

    const runOnce = useCallback(() => {
        if (oncer) retimer();
        setOncer(false);
    }, [oncer, retimer]);

    useEffect(() => {
        if (!timerVar) {
            runOnce();
            setTimeVar(setInterval(() => {
                retimer();
            }, Config.refreshTimeInterval(Math.random())));
        }
    }, [comment, retimer, timerVar, runOnce])

    const timer = () => {
        return (<>
            <Box fontSize={blockTimerFontSize}>{created}</Box>{
                updated && updated !== created ?
                    <Box pl={1} fontSize={blockTimerFontSize}>(modified {updated})</Box> : null}
        </>);
    }

    const adminToggler = () => {
        adminToggle ? setAdminToggle(null) : setAdminToggle(comment.id);
    }

    const openAdminMenu = () => {
        adminToggle ? setAdminToggle(null) : setAdminToggle(comment.id);
    }

    return (
        <>
            {boss && admincallback ? <CommentAdminPanel comment={comment} toggle={adminToggle} toggler={adminToggler} callback={admincallback} /> : null}
            <HStack w='100%' alignItems={'top'}>
                <VStack justifyContent='space-between'>
                    <Avatar size={avatarBlockHeader} m={[1, 2, 1, 1, 2, 2]} mt={[1, 1, 2, 1, 2, 2]} bg='teal.500' name={nameString} />{isreply}
                    {isreply ? <ArrowUpIcon boxSize={8} color='teal.500' alignSelf={'bottom'} /> : null}
                </VStack>
                <VStack w='100%' ml='0' p='0' pb='2' alignItems='flex-start' spacing='0'>
                    <Flex direction={'row'} w='100%' alignItems='center' pr='5px'>
                        <Box fontSize={commentAuthorFontSize} fontWeight='500'>{nameString}</Box>
                        <Spacer />
                        {timer()}
                        {boss && admincallback ?
                            <Box pl={2}>
                                <Center>
                                    {adminToggle !== comment.id ?
                                        <SettingsIcon mt='2px' boxSize={5} color='green.600' onClick={() => openAdminMenu()} /> :
                                        null
                                    }
                                </Center>
                            </Box> : null}
                    </Flex>
                    {children}
                </VStack>
            </HStack>
        </>)
}

export default CommentHeader;