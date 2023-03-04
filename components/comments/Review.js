import {useRef, useState} from "react";
import {CheckIcon, InfoIcon} from '@chakra-ui/icons'
import {CUIAutoComplete} from "chakra-ui-autocomplete";
import {
    Box,
    Button,
    ButtonGroup,
    Drawer,
    DrawerOverlay,
    InputGroup,
    Popover,
    Portal,
    Input,
    Flex,
    DrawerContent,
    InputRightElement,
    Text,
    PopoverContent,
    PopoverHeader,
    FormControl,
    FormHelperText,
    FormLabel,
    Select,
    Textarea,
    SimpleGrid,
    PopoverFooter,
    Stack,
    HStack,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Container,
    Center,
    Spacer,
    FormErrorMessage,
    Tooltip,
    PopoverTrigger,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    useBoolean
} from '@chakra-ui/react';
import {useGrantsContext} from "../../context/auth.context";
import {useModelContext} from "../../context/model.context";
import {useMenuContext} from "../../context/menu.context";
import {adjustLoadedBlock} from '../../db/model';
import {invertColor, key} from '../../utils/utils';
import {useToast} from '@chakra-ui/react';
import {useDisclosure} from '@chakra-ui/react';
import {SingleDatepicker} from 'chakra-dayzed-datepicker';
import Countries from '../../startup/countries';
import {useUser} from "@auth0/nextjs-auth0/client";

export const requiredColor = 'red.300';
export const desiredColor = 'teal.300';
export const importantColor = 'blue.300';

const Review = () => {
    const {grants, grantsLoading, userType} = useGrantsContext();
    const {model, setModel} = useModelContext();
    const {menu} = useMenuContext();
    const [text, setText] = useState('');
    const [label, setLabel] = useState("");
    const [gbl, setGbl] = useState("");
    const [selectedOption, setSelectedOption] = useState('');
    const [scac, setScac] = useState('');
    const [code, setCode] = useState('');
    const [pickup, setPickup] = useState();
    const [delivery, setDelivery] = useState();
    const [oagent, setOagent] = useState('');
    const [dagent, setDagent] = useState('');
    const [countries, setCountries] = useState(Countries);
    const [ocountry, setOcountry] = useState();
    const [dcountry, setDcountry] = useState('');
    const [ozip, setOzip] = useState('');
    const [dzip, setDzip] = useState('');

    const [isGblDesirable, setIsGblDesirable] = useState(false);
    const [isSCACDesirable, setIsSCACDesirable] = useState(false);
    const [isCodeDesirable, setIsCodeDesirable] = useState(false);
    const [isPickupDesirable, setIsPickupDesirable] = useState(false);
    const [isDeliveryDesirable, setIsDeliveryDesirable] = useState(false);
    const [isOagentDesirable, setIsOagentDesirable] = useState(false);
    const [isDagentDesirable, setIsDagentDesirable] = useState(false);
    const [isOcountryDesirable, setIsOcountryDesirable] = useState(false);
    const [isDcountryDesirable, setIsDcountryDesirable] = useState(false);
    const [isOzipDesirable, setIsOzipDesirable] = useState(false);
    const [isDzipDesirable, setIsDzipDesirable] = useState(false);

    const [textAreaBlured, setTextAreaBlured] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();
    menu.reviewForm = {isOpen, onOpen, onClose};
    const [gblPlaceholder] = useState('QWER1234567');
    const [date, setDate] = useState(new Date());
    const isTextareaEmty = text.length === 0;
    const isGblEmpty = gbl.length === 0;
    const rewiewDrawerFontSize = ['sm', 'lg', 'xl', 'xl', 'lg'];
    const datesLabelSize = ['40%', '40%', '50%', '45%', '35%', '25%'];
    const datesPickerSize = ['60%', '60%', '50%', '45%', '35%', '25%'];

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

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);

        // установить флаги для желательных полей
        setIsGblDesirable(value !== '');
        setIsSCACDesirable(value !== '');
        setIsCodeDesirable(value !== '');
        setIsPickupDesirable(value === '1' || value === '3' || value === '4');
        setIsDeliveryDesirable(value === '1' || value === '5');
        setIsOagentDesirable(value === '1' || value === '3');
        setIsDagentDesirable(value === '1' || value === '5');
        setIsOcountryDesirable(value === '1' || value === '3');
        setIsDcountryDesirable(value === '1' || value === '5');
        setIsOzipDesirable(value === '1' || value === '3');
        setIsDzipDesirable(value === '1' || value === '5');
        // field.gbl.ref.current.focus();
        // field.scac.ref.current.focus();

    };

    const field = {
        experience: {
            id: 'experience',
            isDesired: true,
            value: selectedOption,
            desiredBorderColor: desiredColor,
            placeholder: 'More details about experience',
            handleChange: handleSelectChange,
            info: {
                title: 'Select type of experience',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This important to fill',
                    bg: desiredColor
                }
            }
        },
        label: {
            id: 'label',
            desiredBorderColor: desiredColor,
            isDesired: true,
            value: label,
            placeholder: 'Once in my life',
            handleChange: (event) => setLabel(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)),
            info: {
                title: 'How to brief your experience?',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        text: {
            id: 'text',
            value: text,
            isDesired: true,
            isRequired: true,
            desiredBorderColor: requiredColor,
            placeholder: 'My experience',
            handleChange: (e) => setText(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)),
            handleFocus: () => setTextAreaBlured(false),
            handleBlur: () => textAreaBlured ? null : setTextAreaBlured(true),
            info: {
                title: 'Your experience review',
                infoIconColor: requiredColor,
                tooltip: {
                    label: 'This field required to fill',
                    bg: requiredColor,
                }
            }
        },
        gbl: {
            id: 'gbl',
            value: gbl,
            placeholder: 'QWER1234567',
            variant: 'outline',
            help: '',
            isDesired: isGblDesirable,
            ref: useRef(null),
            handleChange: (e) => setGbl((e.target.value || '').toUpperCase()),
            handleBlur: () => {},
            info: {
                title: 'GBL Number',
                infoIconColor: desiredColor,
                pop: {
                    header: 'Where to find my GBL Number?',
                    body: (<>
                        You can find your GBL number at this document:
                        <img src="/images/gbl.png" alt="My Image"/></>),
                    footer: 'Footer info',
                    bg: invertColor('blue.100'),
                    borderColor: invertColor('blue.200'),
                },
                tooltip: {
                    label: 'This good to fill, to proof your experience. Let me describe where to find gbl number',
                    bg: desiredColor
                }
            }
        },
        scac: {
            id: 'scac',
            value: scac,
            placeholder: 'SCAC',
            variant: 'outline',
            isDesired: isSCACDesirable,
            ref: useRef(null),
            handleChange: (e) => setScac((e.target.value || '').toUpperCase()),
            info: {
                title: 'SCAC',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        code: {
            id: 'code',
            value: code,
            placeholder: 'Code',
            variant: 'outline',
            isDesired: isCodeDesirable,
            helperText: null,
            handleChange: (e) => setCode((e.target.value || '').toUpperCase()),
            info: {
                title: 'CODE',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        pickup: {
            id: 'pickup',
            value: pickup,
            variant: 'outline',
            handleChange: setPickup,
            isDesired: isPickupDesirable,
            desiredBorderColor: desiredColor,
            help: '',
            info: {
                title: 'Picked up date',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        delivered: {
            id: 'delivered',
            value: delivery,
            variant: 'outline',
            handleChange: setDelivery,
            isDesired: isDeliveryDesirable,
            desiredBorderColor: desiredColor,
            help: null,
            info: {
                title: 'Delivered date',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        oagent: {
            id: 'oagent',
            value: '',
            placeholder: 'Transportation organization inc.',
            isDesired: isOagentDesirable,
            variant: 'outline',
            desiredBorderColor: desiredColor,
            help: '',
            handleChange: (e) => setOagent((e.target.value || '').toUpperCase()),
            info: {
                title: 'Origin agent',
                infoIconColor: desiredColor,
                pop: {
                    header: 'Where is my origin TSP?',
                    body: 'This good to fill, readers will breafly understand main idea of your review',
                    footer: 'Footer info',
                    bg: invertColor('blue.100'),
                    borderColor: invertColor('blue.200'),
                }
            }
        },
        dagent: {
            id: 'dagent',
            value: '',
            placeholder: 'Transportation organization inc.',
            isDesired: isDagentDesirable,
            variant: 'outline',
            help: '',
            handleChange: (e) => setDagent((e.target.value || '').toUpperCase()),
            info: {
                title: 'Destination agent',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        ocountry: {
            id: 'ocountry',
            value: '',
            placeholder: 'Travel from...',
            isDesired: isOcountryDesirable,
            variant: 'outline',
            handleChange: setOcountry,
            info: {
                title: 'Origin country',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        dcountry: {
            id: 'dcountry',
            value: '',
            placeholder: 'Traveling to.',
            isDesired: isDcountryDesirable,
            variant: 'outline',
            handleChange: setDcountry,
            info: {
                title: 'Destination country',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        ozip: {
            id: 'ozip',
            value: ozip,
            placeholder: '12345',
            isDesired: isOzipDesirable,
            variant: 'outline',
            handleChange: (e) => setOzip((e.target.value || '').toUpperCase()),
            info: {
                title: 'Origin ZIP',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        },
        dzip: {
            id: 'dzip',
            value: dzip,
            placeholder: '12345',
            isDesired: isDzipDesirable,
            variant: 'outline',
            handleChange: (e) => setDzip((e.target.value || '').toUpperCase()),
            info: {
                title: 'Destination zip',
                infoIconColor: desiredColor,
                tooltip: {
                    label: 'This good to fill, readers will breafly understand main idea of your review',
                    bg: desiredColor
                }
            }
        }
    }

    const handleCreateItem = (item) => {
        setPickerItems((curr) => [...curr, item]);
        setSelectedItems((curr) => [...curr, item]);
    };

    const handleSelectedItemsChange = (selectedItems) => {
        if (selectedItems) {
            setOcountry(selectedItems);
        }
    };

    const customRender = (selected) => {
        return (
            <Flex flexDir="row" alignItems="center">
                <Text>{selected.label}</Text>
            </Flex>
        )
    }

    return (
        <Box w='100%' m={[2, 0, 2, 0]} fontSize={['md', 'md', 'lg', 'lg', 'lg']}>
            <Flex direction='row' alignItems='center' m={['3']}>
                <Box>Have something to write?</Box>
                <Spacer/>
                <Button colorScheme='blue' size={['lg', 'md']} fontSize={['xl', 'xl', 'xl', 'xl', 'lg']}
                        onClick={menu.reviewForm.isOpen ? menu.reviewForm.onClose : menu.reviewForm.onOpen}>Publish
                    review</Button>
            </Flex>
            <form onSubmit={onSubmit}>
                <Drawer
                    isOpen={menu.reviewForm.isOpen}
                    placement='top'
                    size='full'
                    p='0'
                    scrollBehavior='outside'
                    onClose={menu.reviewForm.onClose}>
                    <DrawerOverlay/>
                    <DrawerContent>
                        <DrawerHeader p={[0, 2]} bg={invertColor('blue.100')} fontSize={rewiewDrawerFontSize}>
                            <Container w='100%' pl='2' pr='2' maxW={['xs', 'sm', 'md', 'lg', 'xl', '3xl']}>
                                Let&apos;s write review of your experience
                                <DrawerCloseButton/>
                            </Container>
                        </DrawerHeader>
                        <Container w='100%' p='0' maxW={['xs', 'sm', 'md', 'lg', 'xl', '3xl']} overflowY="auto"
                                   maxH="calc(100vh - 4rem)">
                            <DrawerBody pt={[0, 2]} pl={[0, 2]} pr={[1, 2]} fontSize={rewiewDrawerFontSize}>
                                <Stack align='left'>
                                    <Experience field={field.experience}/>
                                    <InputField field={field.label}/>
                                    <TextReview field={field.text}/>
                                    <Box>
                                        To proof your experience, please provide some shipment details
                                    </Box>
                                    <InputField field={field.gbl}/>
                                    <SimpleGrid columns={{sm: 1, md: 2}} spacing={4}>
                                        <InputField field={field.code}/>
                                        <InputField field={field.scac}/>
                                    </SimpleGrid>
                                    <SimpleGrid columns={{sm: 1, md: 2}} spacing={4}>
                                        <DatePicker field={field.pickup}/>
                                        <DatePicker field={field.delivered}/>
                                    </SimpleGrid>
                                    <InputField field={field.oagent}/>
                                    <InputField field={field.dagent}/>
                                    <SimpleGrid columns={{sm: 1, md: 2}} spacing={4}>
                                        <CountryField field={field.ocountry}/>
                                        <CountryField field={field.dcountry}/>
                                    </SimpleGrid>
                                    <SimpleGrid columns={{sm: 1, md: 2}} spacing={4}>
                                        <InputField field={field.ozip}/>
                                        <InputField field={field.dzip}/>
                                    </SimpleGrid>
                                </Stack>
                            </DrawerBody>
                        </Container>
                        <Container w='100%' p='0' maxW={['xs', 'sm', 'md', 'lg', 'xl', '3xl']}
                                   maxH="calc(100vh - 4rem)">
                            <Box mt="auto" position="sticky" bottom="0" zIndex={999}>
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
                            </Box>
                        </Container>
                    </DrawerContent>
                </Drawer>
            </form>
        </Box>
    );
};

function DatePicker({field}) {
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
            errorBorderColor: desiredColor,
            size: ["lg"],
            h: '50px',
            p: '2'
        }
    };

    return (
        <FormControl isInvalid={field.isDesired} errorBorderColor={field.desiredBorderColor}>
            <FieldLabel field={field.info} showTip={field.isDesired}/>
            <SingleDatepicker
                name="date-input"
                minDate={new Date((new Date().getTime() - 1000 * 3600 * 24 * 365))}
                maxDate={new Date((new Date().getTime() + 1000 * 3600 * 24 * 365))}
                date={field.value}
                variant={field.variant}
                onDateChange={field.handleChange}
                configs={{
                    dateFormat: 'd MMMM yyyy',
                    firstDayOfWeek: 1, // default is 0, the dayNames[0], which is Sunday if you don't specify your own dayNames,
                }}
                propsConfigs={datePickerConfig}
            />
            {!!field.help ?
                <FormHelperText>
                    {field.help}
                </FormHelperText> : null}
        </FormControl>
    )
}

function FieldLabel({field, showTip = true}) {
    const iconColor = showTip ? field.infoIconColor : 'gray.400';
    const bg = showTip && field?.tooltip?.bg ? field.tooltip.bg : 'gray.400';
    const labelColor = showTip ? 'gray.800' : 'gray.400';
    return (
        field ?
            <FormLabel>
                {showTip || true ?
                    field.pop && (field.pop.header + field.pop.body + field.pop.footer) ?
                        <Popper field={field.pop}>
                            {func => (<InfoIcon sx={{cursor: 'pointer'}} fontSize={'lg'} color={iconColor}
                                                mr={'10px'} onClick={func}/>)}
                        </Popper> :
                        field.tooltip.label ?
                            <Tooltip label={field.tooltip.label} bg={bg} boxShadow='md'>
                                <InfoIcon fontSize={'lg'} color={iconColor} mr={'10px'}/>
                            </Tooltip> : null
                    : null}
                {field.title}
            </FormLabel> : null
    )
}


function InputField({field}) {
    return (
        <FormControl>
            <FieldLabel field={field.info} showTip={field.isDesired}/>
            <Input id={field.id}
                   variant={field.variant}
                   value={field.value}
                   errorBorderColor={field.errorBorderColor || 'teal.300'}
                   isInvalid={field.isDesired}
                   onChange={field.handleChange}
                   placeholder={field.placeholder}/>
            {field.helperText ? <FormHelperText>{field.helperText}</FormHelperText> : null}
            {!!field.help ?
                <FormHelperText>
                    {field.help}
                </FormHelperText> : null}
            <FormErrorMessage>{field.error}</FormErrorMessage>
        </FormControl>
    )
}

function CountryField({field}) {
    return (
        <FormControl>
            <FieldLabel field={field.info} showTip={field.isDesired}/>
            <Select placeholder={field.placeholder}
                    id={field.id}
                    isInvalid={field.isDesired || false}
                    errorBorderColor={field.errorBorderColor || 'teal.300'}
                    name={field.id}
                    onChange={field.handleChange}>
                {Countries.map(c =>
                    <option value={c.id}>{c.index} {c.name}</option>)
                }
            </Select>
        </FormControl>
    )
}

function Experience({field}) {
    return (
        <FormControl>
            <FieldLabel field={field.info} showTip={field.isDesired}/>
            <Select id={field.id}
                    isInvalid={field.isDesired || !field.value}
                    placeholder={field.placeholder}
                    errorBorderColor={field.desiredBorderColor}
                    onChange={field.handleChange}>
                <option value='1'>Overall experience with this shipment</option>
                <option value='2'>Experience with booking this shipment</option>
                <option value='3'>Experience with shipment packing and pickup services</option>
                <option value='4'>Experience while my shipment was underway</option>
                <option value='5'>Experience with shipment delivery services</option>
                <option value='6'>Experience with the claims process and settlement</option>
            </Select>
        </FormControl>
    )
}

function TextReview({field}) {
    return (
        <FormControl isRequired={true}>
            <FieldLabel field={field.info} showTip={(!field.value && (field.isDesired || field.isRequired)) || (field.value && field.isInvalid)}/>
            <Textarea
                p={['5px', '', '', '', '', '']}
                placeholder={field.placeholder}
                size='sm'
                h='9em'
                isInvalid={true}
                errorBorderColor={field.desiredBorderColor}
                // fontSize={rewiewDrawerFontSize}
                className="comment-form-textarea"
                value={field.value}
                onChange={field.handleChange}
                onFocus={field.handleFocus}
                onBlur={field.handleBlur}
            />
        </FormControl>
    )
}

function Popper({children, field}) {
    const [open, setOpen] = useBoolean();
    const func = () => open.on;
    return (
        field.header + field.body + field.footer ?
            <Popover boxShadow='dark-lg'>
                <PopoverTrigger>
                    {children(func)}
                </PopoverTrigger>
                <PopoverContent boxShadow='dark-lg' bg={field.bg} borderColor={field.borderColor}>
                    <PopoverArrow/>
                    {field.header ? <PopoverHeader>{field.header}</PopoverHeader> : null}
                    {field.body ? <PopoverBody>{field.body}</PopoverBody> : null}
                    <PopoverCloseButton/>
                    {field.footer ? <PopoverFooter>{field.footer}</PopoverFooter> : null}
                </PopoverContent>
            </Popover> : null
    )
}

export default Review;

