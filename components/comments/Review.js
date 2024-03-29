import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
    Box, Button, ButtonGroup, Code, Drawer, DrawerOverlay, Grid, GridItem,
    Input, Flex, Text, InputGroup, InputLeftElement, DrawerContent,
    FormControl, FormHelperText, FormLabel, Select, Textarea,
    Stack, HStack, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter,
    Container, Center, Spacer
} from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { useMenuContext } from "../../context/menu.context";
import { adjustLoadedBlock } from '../../db/model';
import { key } from '../../utils/utils';
import { useToast } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import {useUser} from "@auth0/nextjs-auth0/client";

// import LoginButton from '../LoginButton';

const Review = () => {
    const { grants, grantsLoading, boss } = useGrantsContext();
    const { model, setModel } = useModelContext();
    const { menu, adForm, setAdForm } = useMenuContext();
    const [text, setText] = useState('');
    const [label, setLabel] = useState("");
    const [gbl, setGbl] = useState("");
    const [textAreaBlured, setTextAreaBlured] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    menu.reviewForm = { isOpen, onOpen, onClose };

    const { isLoading } = useUser();
    // menu.setReviewForm({ isOpen, onOpen, onClose });

    const [gblPlaceholder, setGblPlaceholder] = useState('QWER1234567');

    const [date, setDate] = useState(new Date());

    const absentRole = (!grants || !grants.role);

    // const openProfile = true;//(!grantsLoading && !absentRole && ['guest'].find(v => v === grants.role));

    const isTextareaEmty = text.length === 0;

    const isGblEmpty = gbl.length === 0;

    const rewiewDrawerFontSize = ['sm', 'lg', 'xl', 'xl', 'xl'];
    const datesLabelSize = ['40%', '40%', '50%', '45%', '35%','25%'];
    const datesPickerSize = ['60%', '60%', '50%', '45%', '35%','25%'];

    const datePickerConfig = {
        dateNavBtnProps: {
            colorScheme: "blue",
            variant: "outline"
        },
        dayOfMonthBtnProps: {
            defaultBtnProps: {
                borderColor: "red.300",
                _hover: {
                    background: 'blue.400',
                }
            },
            isInRangeBtnProps: {
                color: "yellow",
            },
            selectedBtnProps: {
                background: "blue.200",
                color: "green",
            },
            todayBtnProps: {
                background: "teal.400",
            }
        },
        inputProps: {
            size: ["lg"],
            h: '50px',
            p: '2'
        }
    };

    const openProfileGBL = () => {
        return false;
    }

    //what user what top level block type can create
    const blockType = {
        'admin': 'ad',
        'moder': 'ad',
        'user': 'review',
    }

    //user can add top level block, what user, and depend of it block type, can have label field
    const userHaslabel = () => {
        switch (grants.role) {
            case 'admin':
            case 'moder':
            case 'user':
                return true
            default:
                return false
        }
    }

    const allowedRole = (role) => ['user', 'admin', 'moder'].find(v => v === grants);

    const bodyType = () => {
        ['admin', 'moderator'].find(v => v === grants.role) ? 'ad' : 'review';
    }

    const handleChangeLabel = (event) => {
        setLabel(event.target.value);
    }

    const handleChangeGbl = (event) => {
        setGbl(event.target.value);
    }

    const addComment = async (block) => {
        const options = {
            headers: {
                'Authorization': `Bearer ${grants.token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(block),
            method: 'POST',
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/block`,
            options
        );
        switch (response.status) {
            case '200':
            case '201':
                const responseData = await response.json();
                return responseData;
            case '500':
                toast({
                    title: `${text}`,
                    status: `error`,
                    isClosable: true,
                });
                break;
            default:
                break;
        }
        // const obj = adjustBlock(responseData)
        // model = model.concat(obj);
        // setModel(model);
        // model = model.concat(responseData);
        // setModel(model);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (grantsLoading) return false;
        const obj = {
            id: key(),
            type: 'review',
            ref_user: grants.ref_user,
            label,
            text,
        }
        const back = await addComment(obj);
        const block = adjustLoadedBlock(back);
        setModel(model.concat(block));
        setText("");
        setLabel("");
    }

    const promptToSignUp = ((!isTextareaEmty && !isGblEmpty) && ((!!!grants.role) || (grants.role == 'anon')))

    const canSave = () => {
        if (grants?.role === 'user') {
            return ((!isTextareaEmty) && (!isGblEmpty))
        }
        if ((grants?.role === 'admin') || (grants?.role === 'moder')) {
            return !isTextareaEmty
        }
        return ((!isTextareaEmty) && (!isGblEmpty))
    }

    const Cancel = () => {
        setText("");
        setLabel("");
        setGbl("");
        onClose();
    }

    return (
        <Box w='100%' m={[2, 0, 2, 0]} fontSize={['md', 'md', 'lg', 'lg', 'lg']}>
            {isLoading ? null : boss ?
                !adForm ?
            <Flex direction='row' alignItems='center' m={['3']}>
                <Box>Have something to write?</Box>
                <Spacer />
                <Button colorScheme='blue' size={['lg', 'md']} fontSize={['xl', 'xl', 'xl', 'xl', 'lg']} onClick={() => setAdForm(true)}>Publish Article</Button>
            </Flex> : null :
                <Flex direction='row' alignItems='center' m={['3']}>
                    <Box>Have something to write?</Box>
                    <Spacer />
                    <Button colorScheme='blue' size={['lg', 'md']} fontSize={['xl', 'xl', 'xl', 'xl', 'lg']} onClick={menu.reviewForm.isOpen ? menu.reviewForm.onClose : menu.reviewForm.onOpen}>Publish review</Button>
                </Flex>
            }
            <Drawer
                isOpen={menu.reviewForm.isOpen}
                placement='top'
                size='full'
                p='0'
                scrollBehavior='outside'
                onClose={menu.reviewForm.onClose} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader p={[0, 2]} bg='blue.100' fontSize={rewiewDrawerFontSize}>
                        <Container w='100%' pl='2' pr='2' maxW={['xs', 'sm', 'md', 'lg', 'xl', '3xl']}>
                            Let&apos;s drop review of your experience
                            <DrawerCloseButton />
                        </Container>
                    </DrawerHeader>
                    <Container w='100%' p='0' maxW={['xs', 'sm', 'md', 'lg', 'xl', '3xl']}>
                        <DrawerBody pt={[0, 2]} pl={[0, 2]} pr={[1, 2]} fontSize={rewiewDrawerFontSize}>
                            <FormControl>
                                <form onSubmit={onSubmit}>
                                    <Stack align='left'>
                                        <HStack>
                                            <Box><nobr>GBL Number</nobr></Box>
                                            <Input fontSize={rewiewDrawerFontSize} h='2em' bg='orange.50' variant='outline' value={gbl} onChange={handleChangeGbl} placeholder={gblPlaceholder} />
                                        </HStack>
                                        <Select fontSize='xl' size='lg' placeholder='More details about experience'>
                                            <option value='option1'>My booking service experience</option>
                                            <option value='option1'>My origin pickup experience</option>
                                            <option value='option2'>My transit information experience</option>
                                            <option value='option3'>My destination delivery experience</option>
                                            <option value='option3'>My claim experience</option>
                                        </Select>
                                        <Input bg='orange.50' h='2em' fontSize={rewiewDrawerFontSize} variant='outline' value={label} onChange={handleChangeLabel} placeholder={'Subject'} />
                                        <Textarea
                                            p={['5px', '', '', '', '', '']}
                                            // m={0}
                                            placeholder="My experience"
                                            bg='orange.50'
                                            size='sm'
                                            h='9em'
                                            fontSize={rewiewDrawerFontSize}
                                            className="comment-form-textarea"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            onFocus={() => { setTextAreaBlured(false) }}
                                            onBlur={() => { textAreaBlured ? null : setTextAreaBlured(true) }}
                                        />
                                        <HStack>
                                            <Box p={0} w={datesLabelSize} fontSize={rewiewDrawerFontSize}>
                                                <Box>Requested pickup</Box>
                                            </Box>
                                            <Box p={0} w={datesPickerSize} fontSize={rewiewDrawerFontSize}>
                                                <SingleDatepicker
                                                    name="date-input"
                                                    minDate={new Date((new Date().getTime() - 1000 * 3600 * 24 * 365))}
                                                    maxDate={new Date((new Date().getTime() + 1000 * 3600 * 24 * 365))}
                                                    date={date}
                                                    onDateChange={setDate}
                                                    configs={{
                                                        dateFormat: 'd MMMM yyyy',
                                                        firstDayOfWeek: 1, // default is 0, the dayNames[0], which is Sunday if you don't specify your own dayNames,
                                                    }}
                                                    propsConfigs={datePickerConfig}
                                                />
                                            </Box>
                                        </HStack>
                                        {/* </Box> */}
                                        <HStack>
                                            <Box p={0} w={datesLabelSize} fontSize={rewiewDrawerFontSize}>
                                                <Box>Actual pickup</Box>
                                            </Box>
                                            <Box p={0} w={datesPickerSize} fontSize={rewiewDrawerFontSize}>
                                                <SingleDatepicker
                                                    name="date-input"
                                                    minDate={new Date((new Date().getTime() - 1000 * 3600 * 24 * 365))}
                                                    maxDate={new Date((new Date().getTime() + 1000 * 3600 * 24 * 365))}
                                                    date={date}
                                                    onDateChange={setDate}
                                                    configs={{
                                                        dateFormat: 'd MMMM yyyy',
                                                        firstDayOfWeek: 1, // default is 0, the dayNames[0], which is Sunday if you don't specify your own dayNames,
                                                    }}
                                                    propsConfigs={datePickerConfig}
                                                />
                                            </Box>
                                        </HStack>
                                        <HStack>
                                            <Box p={0} w={datesLabelSize} fontSize={rewiewDrawerFontSize}>
                                                <Box>Requested delivery</Box>
                                            </Box>
                                            <Box p={0} w={datesPickerSize} fontSize={rewiewDrawerFontSize}>
                                                <SingleDatepicker
                                                    name="date-input"
                                                    minDate={new Date((new Date().getTime() - 1000 * 3600 * 24 * 365))}
                                                    maxDate={new Date((new Date().getTime() + 1000 * 3600 * 24 * 365))}
                                                    date={date}
                                                    onDateChange={setDate}
                                                    configs={{
                                                        dateFormat: 'd MMMM yyyy',
                                                        firstDayOfWeek: 1, // default is 0, the dayNames[0], which is Sunday if you don't specify your own dayNames,
                                                    }}
                                                    propsConfigs={datePickerConfig}
                                                />
                                            </Box>
                                        </HStack>
                                        <HStack>
                                            <Box p={0} w={datesLabelSize} fontSize={rewiewDrawerFontSize}>
                                                <Box>Actual delivery</Box>
                                            </Box>
                                            <Box p={0} w={datesPickerSize} fontSize={rewiewDrawerFontSize}>
                                                <SingleDatepicker
                                                    name="date-input"
                                                    minDate={new Date((new Date().getTime() - 1000 * 3600 * 24 * 365))}
                                                    maxDate={new Date((new Date().getTime() + 1000 * 3600 * 24 * 365))}
                                                    date={date}
                                                    onDateChange={setDate}
                                                    configs={{
                                                        dateFormat: 'd MMMM yyyy',
                                                        firstDayOfWeek: 1, // default is 0, the dayNames[0], which is Sunday if you don't specify your own dayNames,
                                                    }}
                                                    propsConfigs={datePickerConfig}
                                                />
                                            </Box>
                                        </HStack>
                                        <DrawerFooter>
                                            <ButtonGroup variant='solid' spacing='6'>
                                                <Button
                                                    // colorScheme='blue'
                                                    variant='solid'
                                                    colorScheme='facebook'
                                                    size={['md']}
                                                    type='submit'
                                                    disabled={!canSave()}>Write review
                                                </Button>
                                                <Button
                                                    colorScheme='orange'
                                                    size={['md']}
                                                    // disabled={!canSave()}
                                                    onClick={() => Cancel()}>Cancel</Button>
                                            </ButtonGroup>
                                        </DrawerFooter>
                                    </Stack>
                                </form>
                            </FormControl>
                        </DrawerBody>
                    </Container>
                </DrawerContent>
            </Drawer>
        </Box >
    );
};

export default Review;
