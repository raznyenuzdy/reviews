import {
    Avatar, Box, Container, Flex, HStack, Spacer, Stack, Tooltip, Center, useColorModeValue, IconButton, useColorMode
} from '@chakra-ui/react';
import {useEffect, useState, useCallback} from 'react';
// import {useGrantsContext} from "../../context/auth.context";
import {HamburgerIcon} from '@chakra-ui/icons';
import {buildName, applyHumanTime, invertColor, boss} from '../../utils/utils';
import BlockAdminPanel from './BlockAdminPanel';
import {avatarBlockHeader, blockHeaderFontSize, blockTimerFontSize, notApprovedColor} from '../../startup/theming';
import Config from '../../startup/config';
import {useUser} from "@auth0/nextjs-auth0/client";
import {useGrantsContext} from "../../context/auth.context";

const BlockHeader = ({block, admincallback}) => {

    const { boss } = useGrantsContext();

    const [oncer, setOncer] = useState(true)

    const [timerVar, setTimeVar] = useState(null);

    const [created, setCreated] = useState('');

    const [updated, setUpdated] = useState('');

    const [adminToggle, setAdminToggle] = useState(null);

    const username = buildName(block.user_model);

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
            {boss && admincallback || true ? <BlockAdminPanel block={block} toggle={adminToggle} toggler={adminToggler}
                                                      admincallback={admincallback}/> : null}
            <Container pl='2' pr='2' pt='2' pb='2' bg={invertColor('blue.100')}>
                <Flex>
                    <HStack spacing='2'>
                        <Tooltip label={username} bg={notApprovedColor}>
                            <Avatar
                                src={block.user_model.picture}
                                size={avatarBlockHeader}
                                bg={invertColor('teal.500')}
                                name={username}
                            />
                        </Tooltip>
                        <Stack spacing={0}>
                            <Box fontSize={blockHeaderFontSize}>{username}</Box>
                        </Stack>
                    </HStack>
                    <Spacer/>
                    <Center>
                        <HStack spacing={0}>
                            {timer()}
                            {boss && admincallback ?
                                <Box pl={2}>
                                    <Center>{adminToggle !== block.id ?
                                        <Tooltip openDelay={500} label='Open admin panel'>
                                            <IconButton
                                                size={'xl'}
                                                color={invertColor('green.700')}
                                                fontSize='xl'
                                                variant="linkIcon"
                                                onClick={adminToggler}
                                                icon={<HamburgerIcon aria-label={'Open menu'}/>}
                                                aria-label={'Open Menu'}
                                            />
                                        </Tooltip> :
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
