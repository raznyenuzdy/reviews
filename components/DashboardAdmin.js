import {useRef} from 'react';
import {HamburgerIcon, CloseIcon} from '@chakra-ui/icons';
import {
    Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, IconButton,
    DrawerBody, DrawerFooter, FormControl, FormLabel, Switch, Button, Container
} from '@chakra-ui/react';
import {useMenuContext} from "../context/menu.context";
import {useModelContext} from "../context/model.context";
import {useDisclosure} from '@chakra-ui/react';
import {maxWidthDashboardAdmin} from '../startup/theming';
import {getBlocksBackend, getBlocksFrontend} from '../db/model';
import {httpApi} from "../utils/http";
import Router from 'next/router';
import {invertColor} from "../utils/utils";

const DashboardAdmin = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {menu} = useMenuContext();
    const {state, setState} = useModelContext();
    const btnRef = useRef();

    const toggleShowDels = (e) => {
        menu.setShowDeleted(menu.showDeleted = e.target.checked); //чертова мутация. мутировать надо и свойство и контекст
    }

    const onSave = async () => {
        // state.page = 1;
        // state.setPage(state.page);
        // state.model = loaded.model;
        // state.setModel(state.model);
        onClose();
        // Router.reload(window.location.pathname)
        // const header = {showDeleted: menu.showDeleted};
        // const response = await httpApi('GET', `/api/block/page/0`, header);
        // if (!response) return;
        // if (response.status !== 200) {
        //     inAppEvent.emit('errorEvent', [response.status, response.responseData]);
        //     return;
        // }
        // const model = response.responseData.filter(r => !!r);
        // const m = [].concat(model ?? []);
        // state.setModel(m);
        // const st = {...state};
        // setState(st);
    }

    return (
        <>
            <IconButton
                size={'xl'}
                fontSize='xl'
                variant="linkIcon"
                icon=<HamburgerIcon aria-label={'Open menu'}/>
            aria-label={'Open Menu'}
            // display={{md: 'none'}}
            onClick={isOpen ? onClose : onOpen}
            />
            <Drawer
                isOpen={isOpen}
                colorScheme='blue'
                placement='top'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader p={[2]} bg={invertColor('blue.100')}>
                        <Container w='100%' pl='2' pr='2' maxW={maxWidthDashboardAdmin}>
                            Administrative functionality dashboard
                        </Container>
                    </DrawerHeader>
                    <Container w='100%' maxW={maxWidthDashboardAdmin} p='0'>
                        <DrawerBody pt={[0, 2]} pl={['2']} pr={['2']}>
                            <FormControl display='flex' alignItems='center'>
                                <FormLabel htmlFor='email-alerts' mb='0'>
                                    Show deleted posts?
                                </FormLabel>
                                <Switch id='showDels' onChange={toggleShowDels} isChecked={menu.showDeleted}/>
                            </FormControl>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={onSave}>Save</Button>
                        </DrawerFooter>
                    </Container>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DashboardAdmin;
