import {
    Avatar, Box, Container, Flex, HStack, Spacer, Stack, Text, Center
} from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { useGrantsContext } from "../../context/auth.context";
import { HamburgerIcon } from '@chakra-ui/icons';
import { buildName, applyHumanTime } from '../../utils/utils';
import BlockAdminPanel from './BlockAdminPanel';
import { avatarBlockHeader, blockHeaderFontSize, blockTimerFontSize } from '../../startup/theming';
import Config from '../../startup/config';

const BlockHeader = ({ block, admin }) => {

    const [oncer, setOncer] = useState(true)

    const [timerVar, setTimeVar] = useState(null);

    const [created, setCreated] = useState('');

    const [updated, setUpdated] = useState('');

    const { boss } = useGrantsContext();

    const [adminToggle, setAdminToggle] = useState(null);

    const adminToggler = () => {
        adminToggle ? setAdminToggle(null) : setAdminToggle(block.id);
    }

    const retimer = useCallback(() => {
        setUpdated(applyHumanTime(block.updatedAt));
        setCreated(applyHumanTime(block.createdAt));
    }, [block])

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
    }, [block, retimer, timerVar, runOnce])

    const timer = () => {
        return (<>
            <Box fontSize={blockTimerFontSize}>{created}</Box>{
                updated && updated !== created ?
                    <Box pl={1} fontSize={blockTimerFontSize}>(modified {updated})</Box> : null}
        </>);
    }

    return (
        <>
            {boss ? <BlockAdminPanel block={block} toggle={adminToggle} toggler={adminToggler} /> : null}
            <Container pl='2' pr='2' pt='2' pb='2' bg='blue.100'>
                <Flex>
                    <HStack spacing='2'>
                        <Avatar size={avatarBlockHeader} bg='teal.500' name={"Y P"} />
                        <Stack spacing={0}>
                            <Box fontSize={blockHeaderFontSize}>{buildName(block.user_model)}</Box>
                        </Stack>
                    </HStack>
                    <Spacer />
                    <Center>
                        <HStack spacing={0}>
                            {timer()}
                            {boss ?
                                <Box pl={2}>
                                    <Center>{admin !== block.id ?
                                        <HamburgerIcon boxSize={6} color='green.600' onClick={adminToggler} /> :
                                        null}
                                    </Center>
                                </Box> : null}
                        </HStack>
                    </Center>
                </Flex>
            </Container>
        </>)
}

export default BlockHeader;