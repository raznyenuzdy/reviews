import React from 'react';
import { useToast } from '@chakra-ui/react';
import inAppEvent from '../startup/events';

const dafaultError = 'Service error occured';

const Error = () => {
    const toast = useToast()

    inAppEvent.clear('errorEvent');
    inAppEvent.on('errorEvent', handleError);

    function handleError(args) {
        let [status, error] = args;
        const title = status ? 'Error code: ' + status : 'Error';
        const description = typeof error === 'string' ? error : error.message || dafaultError;
        toast({
            title,
            description,
            status: 'error', //info" | "warning" | "success" | "error" | "loading"
            duration: 9000,
            isClosable: true,
          })
    }
    return <></>
}

export default Error;
