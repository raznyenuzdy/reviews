// import { useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import {
//     Box, Button, ButtonGroup, Code, Drawer, DrawerOverlay,
//     Input, Text, InputGroup, InputLeftElement, DrawerContent,
//     FormControl, FormHelperText, FormLabel, Select, Textarea,
//     Stack, HStack, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Flex, Spacer
// } from '@chakra-ui/react';
// import { useGrantsContext } from "../../context/auth.context";
// import { useModelContext } from "../../context/model.context";
// import { useMenuContext } from "../../context/menu.context";
// import { adjustLoadedBlock } from '../../db/model';
// import { key, blockType } from '../../utils/utils';
// import { useToast } from '@chakra-ui/react'
// import { useDisclosure } from '@chakra-ui/react'
// // import LoginButton from '../LoginButton';
//
// const Ad = ({
//     handleSubmit,
//     submitLabel,
//     hasCancelButton = true,
//     handleCancel,
//     initialText = "",
//     initialLabel = ""
// }) => {
//     const { menu, setMenu } = useMenuContext();
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const { grants, grantsLoading } = useGrantsContext();
//     const { model, setModel } = useModelContext();
//     const [text, setText] = useState(initialText);
//     const [label, setLabel] = useState(initialLabel);
//     const [gbl, setGbl] = useState("");
//     const [textAreaBlured, setTextAreaBlured] = useState(false);
//     const [labelPlaceholder, setLabelPlaceholder] = useState('Topic');
//     const [gblPlaceholder, setGblPlaceholder] = useState('QWER1234567');
//     const isTextareaEmty = text.length === 0;
//     const isGblEmpty = gbl.length === 0;
//     menu.adForm = { isOpen, onOpen, onClose };
//
//     const handleChangeLabel = (event) => {
//         setLabel(event.target.value);
//     }
//
//     const labelInput = () => {
//         return userHaslabel() ?
//             <Input bg='orange.50' variant='outline' value={label} onChange={handleChangeLabel} placeholder={labelPlaceholder} /> :
//             <FormLabel>Have something interesting?</FormLabel>
//     }
//
//     const addComment = async (block) => {
//         const options = {
//             headers: {
//                 'Authorization': `Bearer ${grants.token}`,
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify(block),
//             method: 'POST',
//         }
//         const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/block`,
//             options
//         );
//         switch (response.status) {
//             case '200':
//             case '201':
//                 const responseData = await response.json();
//                 return responseData;
//             case '500':
//                 toast({
//                     title: `${text}`,
//                     status: `error`,
//                     isClosable: true,
//                 });
//                 break;
//             default:
//                 break;
//         }
//         // const obj = adjustBlock(responseData)
//         // model = model.concat(obj);
//         // setModel(model);
//         // model = model.concat(responseData);
//         // setModel(model);
//     }
//
//     const prepAdType = () => {
//         switch (grants.role) {
//             case 'admin':
//             case 'moder':
//                 return 'ad';
//             case 'user':
//             case 'guest': //it will be prompted to sign up with gbl, and if approved, will become an user
//                 return 'review';
//             case 'org':
//                 return 'org';
//             default:
//                 break;
//         }
//     }
//
//     const onSubmit = async (event) => {
//         event.preventDefault();
//         if (grantsLoading) return false;
//         // if (absentRole) return false;
//         if (askLogin) loginWithPopup();
//         // if (openProfile) return openProfileGBL();
//         const obj = {
//             id: key(),
//             type: prepAdType(),
//             // ref_parent: comment.id,
//             ref_user: grants.ref_user,
//             // ref_page: 0,
//             // type: blockType[grants.role],
//             label, //: grants.role === 'user' ? null : label,
//             text,
//             // createdAt: new Date().toISOString(),
//             // updatedAt: null,
//         }
//         const back = await addComment(obj);
//         const block = adjustLoadedBlock(back);
//         // model = model.concat(block);
//         setModel(model.concat(block));
//         setText("");
//         setLabel("");
//     }
//
//     const badRoleWarning = () => {
//         switch (grants.role) {
//             case '':
//             case 'anon':
//             case 'guest':
//                 return guestPoster()
//             case 'admin':
//             case 'moder':
//             case 'user':
//                 break;
//             default:
//                 break;
//         }
//     }
//
//     const gblInput = () => (
//         <HStack>
//             <Box><nobr>GBL Number</nobr></Box>
//             <Input bg='orange.50' variant='outline' value={gbl} onChange={handleChangeGbl} placeholder={gblPlaceholder} />
//         </HStack>
//     )
//
//     const gblOrTextIsEmpty = () => {
//         return (<Box color='green'>To proof, please, let to know your GBL number.</Box>)
//         // return (textAreaBlured && !isTextareaEmty && isGblEmpty) ?
//         //     <Box bg='green' w='100%' p={2} color='white'>To proof, please, let to know your GBL number.</Box> :
//         //     (textAreaBlured && !isTextareaEmty && isGblEmpty) ?
//         //         <Code children='Signup to post your message.' /> : null
//     }
//
//     const promptToSignUp = ((!isTextareaEmty && !isGblEmpty) && ((!!!grants.role) || (grants.role == 'anon')))
//
//     const guestPoster = () => (
//         <>
//             {gblInput()}
//             {gblOrTextIsEmpty()}
//         </>
//     )
//
//     const canSave = () => {
//         if (grants.role === 'user') {
//             return ((!isTextareaEmty) && (!isGblEmpty))
//         }
//         if ((grants.role === 'admin') || (grants.role === 'moder')) {
//             return !isTextareaEmty
//         }
//         return ((!isTextareaEmty) && (!isGblEmpty))
//         // return false
//     }
//
//     const onTextAreaEdit = (e) => {
//         setText(e);
//         // setText(e);
//         // setIsTextareaEmty(text.length === 0)
//     }
//     // gbl.length === 0
//
//     const Cancel = () => {
//         setText("");
//         setLabel("");
//         setGbl("");
//         onClose();
//     }
//
//     return (
//         <Box w='100%' m={[2, 0, 2, 0]} fontSize={['md', 'md', 'lg', 'lg', 'lg']}>
//             <Flex direction='row' alignItems='center' mt={[0]} mb={[3]}>
//                 <Button colorScheme='blue' size={['lg', 'md']} fontSize={['xl', 'xl', 'xl', 'xl', 'lg']} onClick={menu.adForm.isOpen ? menu.adForm.onClose : menu.adForm.onOpen}>`Publish new Article</Button>
//             </Flex>
//             <Drawer
//                 isOpen={menu.adForm.isOpen}
//                 placement='top'
//                 onClose={menu.adForm.onClose} >
//                 <DrawerOverlay />
//                 <DrawerContent>
//                     <DrawerCloseButton />
//                     <DrawerHeader>Let&apos;s drop review of your experience</DrawerHeader>
//                     <DrawerBody>
//                         <Box p='0'>
//                             <FormControl>
//                                 <form onSubmit={onSubmit}>
//                                     <Stack align='left' spacing={1} pt='2' pb='2'>
//                                         <Box size='xl'>Your gbl is :</Box>
//                                         <Input bg='orange.50' variant='outline' value={label} onChange={handleChangeLabel} placeholder={labelPlaceholder} />
//                                         <Select placeholder='More details about experience'>
//                                             <option value='option1'>My booking service experience</option>
//                                             <option value='option1'>My origin pickup experience</option>
//                                             <option value='option2'>My transit information experience</option>
//                                             <option value='option3'>My destination delivery experience</option>
//                                             <option value='option3'>My claim experience</option>
//                                         </Select>
//                                         <Textarea
//                                             // p='0.2em'
//                                             // m={0}
//                                             placeholder="My experience"
//                                             bg='orange.50'
//                                             size='xs'
//                                             className="comment-form-textarea"
//                                             value={text}
//                                             onChange={(e) => setText(e.target.value)}
//                                             onFocus={() => { setTextAreaBlured(false) }}
//                                             onBlur={() => { textAreaBlured ? null : setTextAreaBlured(true) }}
//                                         />
//                                         {badRoleWarning()}
//                                         <DrawerFooter>
//                                             <ButtonGroup variant='solid' spacing='6'>
//                                                 <Button
//                                                     // colorScheme='blue'
//                                                     // variant={buttonSaveVariant}
//                                                     colorScheme='facebook'
//                                                     size='sm'
//                                                     type='submit'
//                                                     disabled={!canSave()}>{submitLabel}
//                                                 </Button>
//                                                 {hasCancelButton ? (
//                                                     <Button
//                                                         colorScheme='orange'
//                                                         size='sm'
//                                                         disabled={!canSave()}
//                                                         onClick={() => Cancel()}>Cancel</Button>) : null}
//                                             </ButtonGroup>
//                                         </DrawerFooter>
//                                     </Stack>
//                                 </form>
//                             </FormControl>
//                         </Box>
//                     </DrawerBody>
//                 </DrawerContent>
//             </Drawer>
//         </Box>
//     );
// };
//
// export default Ad;
