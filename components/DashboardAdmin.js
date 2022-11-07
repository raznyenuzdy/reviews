import { useRef } from 'react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {
    Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, IconButton,
    DrawerBody, DrawerFooter, FormControl, FormLabel, Switch, Button, Container
} from '@chakra-ui/react';
import { useMenuContext } from "../context/menu.context";
import { useDisclosure } from '@chakra-ui/react'

const DashboardAdmin = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { menu } = useMenuContext();
    const btnRef = useRef();

    const toggleShowDels = (e) => {
        console.log(e.target.checked);
        menu.setShowDeleted(menu.showDeleted = e.target.checked); //чертова мутация. мутировать надо и свойство и контекст
    }

    return (
        <>
            <IconButton
                size={'xl'}
                fontSize='xl'
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={'Open Menu'}
                // display={{ md: 'none' }}
                onClick={isOpen ? onClose : onOpen}
            />
            <Drawer
                isOpen={isOpen}
                placement='top'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader p={[2]} bg='blue.100'>
                            <Container w='100%' pl='2' pr='2' maxW={['xs', 'sm', 'md', 'lg', 'xl', '2xl']}>
                                Administrative functionality dashboard
                            </Container>
                        </DrawerHeader>
                        <Container w='100%' maxW={['xs', 'sm', 'md', 'lg', 'xl', '2xl']} p='0'>
                        <DrawerBody pt={[0, 2]} pl={['2']} pr={['2']}>
                            <FormControl display='flex' alignItems='center'>
                                <FormLabel htmlFor='email-alerts' mb='0'>
                                    Show deleted posts?
                                </FormLabel>
                                <Switch id='showDels' onChange={toggleShowDels} />
                            </FormControl>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue'>Save</Button>
                        </DrawerFooter>
                    </Container>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DashboardAdmin;