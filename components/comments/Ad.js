import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
    Box, Button, ButtonGroup, Code, Drawer, DrawerOverlay,
    Input, Text, InputGroup, InputLeftElement, DrawerContent,
    FormControl, FormHelperText, FormLabel, Select, Textarea,
    Stack, HStack, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter
} from '@chakra-ui/react';
import { useGrantsContext } from "../../context/auth.context";
import { useModelContext } from "../../context/model.context";
import { useMenuContext } from "../../context/menu.context";
import { adjustLoadedBlock } from '../../db/model2';
import { key, blockType } from '../../utils/utils';
import { useToast } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
// import LoginButton from '../LoginButton';

const Review = ({
    handleSubmit,
    submitLabel,
    hasCancelButton = true,
    handleCancel,
    initialText = "",
    initialLabel = ""
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { grants, grantsLoading } = useGrantsContext();
    const { getAccessTokenSilently, isAuthenticated, logout } = useAuth0();
    const { model, setModel } = useModelContext();
    const { menu } = useMenuContext();
    const [text, setText] = useState(initialText);
    // const [isGblEmpty, setIsGblEmpty] = useState(true);
    // const [isTextareaEmty, setIsTextareaEmty] = useState(true);
    const [label, setLabel] = useState(initialLabel);
    const [gbl, setGbl] = useState("");
    const [textAreaBlured, setTextAreaBlured] = useState(false);
    const { loginWithPopup, login } = useAuth0();

    const [labelPlaceholder, setLabelPlaceholder] = useState('Topic');
    const [gblPlaceholder, setGblPlaceholder] = useState('QWER1234567');

    const absentRole = (!grants || !grants.role);

    const askLogin = !isAuthenticated;//(!grantsLoading && !absentRole && ['', 'anonymouse'].find(v => v === grants.role));

    // const openProfile = true;//(!grantsLoading && !absentRole && ['guest'].find(v => v === grants.role));

    const isTextareaEmty = text.length === 0;

    const isGblEmpty = gbl.length === 0;

    const isBoss = ['admin', 'moder'].find(v => v === grants?.role);

    const openProfileGBL = () => {
        console.log("Profile");
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

    switch (grants?.role) {
        case 'admin':
        case 'moderator':
            labelPlaceholder = 'Ad or artickle subject';
            break;
        case 'user':
        case 'guest':
            labelPlaceholder = 'Overview topic';
            break;
        default:
            break;
    }

    const handleChangeLabel = (event) => {
        setLabel(event.target.value);
    }

    const handleChangeGbl = (event) => {
        setGbl(event.target.value);
    }

    const labelInput = () => {
        return userHaslabel() ?
            <Input bg='orange.50' variant='outline' value={label} onChange={handleChangeLabel} placeholder={labelPlaceholder} /> :
            <FormLabel>Have something interesting?</FormLabel>
    }

    const addComment = async (block) => {
        console.log("BLOCK!??", block);
        grants.token = grants.token ? grants.token : await getAccessTokenSilently();
        const options = {
            headers: {
                'Authorization': `Bearer ${grants.token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(block),
            method: 'POST',
        }
        console.log(block);
        const response = await fetch(
            `http://localhost:5000/api/block`,
            options
        );
        switch (response.status) {
            case '200':
            case '201':
                const responseData = await response.json();
                console.log("CAME BACK:", responseData);
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
        console.log(response.status);
        // const obj = adjustBlock(responseData)
        // model = model.concat(obj);
        // setModel(model);
        // model = model.concat(responseData);
        // setModel(model);
    }

    const prepAdType = () => {
        console.log("WHOAMI:", grants.role);
        switch (grants.role) {
            case 'admin':
            case 'moder':
                return 'ad';
            case 'user':
            case 'guest': //it will be prompted to sign up with gbl, and if approved, will become an user
                return 'review';
            case 'org':
                return 'org';
            default:
                break;
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (grantsLoading) return false;
        // if (absentRole) return false;
        if (askLogin) loginWithPopup();
        // if (openProfile) return openProfileGBL();
        const obj = {
            id: key(),
            type: prepAdType(),
            // ref_parent: comment.id,
            ref_user: grants.ref_user,
            // ref_page: 0,
            // type: blockType[grants.role],
            label, //: grants.role === 'user' ? null : label,
            text,
            // createdAt: new Date().toISOString(),
            // modifiedAt: null,
        }
        const back = await addComment(obj);
        const block = adjustLoadedBlock(back);
        model = model.concat(block);
        setModel(model);
        console.log("MODEL:", model);
        setText("");
        setLabel("");
    }

    const badRoleWarning = () => {
        switch (grants.role) {
            case '':
            case 'anon':
            case 'guest':
                return guestPoster()
            case 'admin':
            case 'moder':
            case 'user':
                break;
            default:
                break;
        }
    }

    const gblInput = () => (
        <HStack>
            <Text><nobr>GBL Number</nobr></Text>
            <Input bg='orange.50' variant='outline' value={gbl} onChange={handleChangeGbl} placeholder={gblPlaceholder} />
        </HStack>
    )

    const gblOrTextIsEmpty = () => {
        return (<Text color='green'>To proof, please, let to know your GBL number.</Text>)
        // return (textAreaBlured && !isTextareaEmty && isGblEmpty) ?
        //     <Box bg='green' w='100%' p={2} color='white'>To proof, please, let to know your GBL number.</Box> :
        //     (textAreaBlured && !isTextareaEmty && isGblEmpty) ?
        //         <Code children='Signup to post your message.' /> : null
    }

    const promptToSignUp = ((!isTextareaEmty && !isGblEmpty) && ((!!!grants.role) || (grants.role == 'anon')))

    const guestPoster = () => (
        <>
            {gblInput()}
            {gblOrTextIsEmpty()}
        </>
    )

    const canSave = () => {
        if (grants.role === 'user') {
            return ((!isTextareaEmty) && (!isGblEmpty))
        }
        if ((grants.role === 'admin') || (grants.role === 'moder')) {
            return !isTextareaEmty
        }
        return ((!isTextareaEmty) && (!isGblEmpty))
        // return false
    }

    const onTextAreaEdit = (e) => {
        text = e;
        // setText(e);
        // console.log("TEXT:", e, text);
        // setIsTextareaEmty(text.length === 0)
    }
    // gbl.length === 0

    const buttonSaveVariant = isAuthenticated ? 'solid' : 'outline';

    const Cancel = () => {
        setText("");
        setLabel("");
        setGbl("");
        onClose();
    }

    // {promptToSignUp ? (<LoginButton
    //     colorScheme="blue"
    //     className="btn btn-primary btn-block"
    //     disabled={grantsLoading}
    //     tabIndex={0}
    //     size='sm'
    //     testId="navbar-login-mobile">
    //     Log in / Sign up
    // </LoginButton>
    // ) : null}

    return (
        <>
            <Stack spacing={4} direction='row' align='center'>
                <Text>Have something to write?</Text>
                <Button colorScheme='blue' size='sm' onClick={isOpen ? onClose : onOpen}>Yes</Button>
            </Stack>

            <Drawer
                isOpen={isOpen}
                placement='top'
                onClose={onClose} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Let&apos;s drop review of your experience</DrawerHeader>
                    <DrawerBody>
                        <Box p='0'>
                            <FormControl>
                                <form onSubmit={onSubmit}>
                                    <Stack align='left' spacing={1} pt='2' pb='2'>
                                        <Text size='xl'>Your gbl is :</Text>
                                        <Input bg='orange.50' variant='outline' value={label} onChange={handleChangeLabel} placeholder={labelPlaceholder} />
                                        <Select placeholder='More details about experience'>
                                            <option value='option1'>My booking service experience</option>
                                            <option value='option1'>My origin pickup experience</option>
                                            <option value='option2'>My transit information experience</option>
                                            <option value='option3'>My destination delivery experience</option>
                                            <option value='option3'>My claim experience</option>
                                        </Select>
                                        <Textarea
                                            // p='0.2em'
                                            // m={0}
                                            placeholder="My experience"
                                            bg='orange.50'
                                            size='xs'
                                            className="comment-form-textarea"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            onFocus={() => { setTextAreaBlured(false) }}
                                            onBlur={() => { textAreaBlured ? null : setTextAreaBlured(true) }}
                                        />
                                        {badRoleWarning()}
                                        <DrawerFooter>
                                            <ButtonGroup variant='solid' spacing='6'>
                                                <Button
                                                    // colorScheme='blue'
                                                    variant={buttonSaveVariant}
                                                    colorScheme='facebook'
                                                    size='sm'
                                                    type='submit'
                                                    disabled={!canSave()}>{submitLabel}
                                                </Button>
                                                {hasCancelButton ? (
                                                    <Button
                                                        colorScheme='orange'
                                                        size='sm'
                                                        disabled={!canSave()}
                                                        onClick={() => Cancel()}>Cancel</Button>) : null}
                                            </ButtonGroup>
                                        </DrawerFooter>
                                    </Stack>
                                </form>
                            </FormControl>
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Review;
