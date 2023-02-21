import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import inAppEvent from '../startup/events';

const dafaultError = 'Service error occured';

const Error = () => {
    const toast = useToast();
    const router = useRouter();

    inAppEvent.clear('errorEvent');
    inAppEvent.on('errorEvent', handleError);

    inAppEvent.clear('forceLogout');
    inAppEvent.on('forceLogout', forceLogout);

    function forceLogout() {
        router.push('/api/auth/login');
    }

    function handleError(args) {
        let [status, error] = args;
        const title = status ? 'Error code: ' + status : 'Error';
        const description = (typeof error === 'string' ? error : (error.description || error.message || error.code || error)) || dafaultError;
        toast({
            title,
            description,
            status: 'error', //info" | "warning" | "success" | "error" | "loading"
            duration: 9000,
            isClosable: true,
        });
    }
    return <></>
}

export default Error;
