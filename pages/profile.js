import React from 'react';
import { Box, Flex, Code, Avatar } from '@chakra-ui/react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Auth0ProviderWithHistory from './api/auth/authC';
import { GrantsContextProvider } from '../context/auth.context';
import { getSession } from '@auth0/nextjs-auth0';
import { MenuContextProvider } from '../context/menu.context';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Layout from '../components/Layout';

export function getServerSideProps(context) {
    console.log(context);
    const session = getSession(context.req, {});
    return {
        props: { user: session?.user || null }, // will be passed to the page component as props
    }
}

function Profile() {
    return (
        <GrantsContextProvider>
            <MenuContextProvider>
                <Layout>
                    {isLoading && <Loading />}
                    {user && (
                        <>
                            <Flex flexDirection='column'>
                                <Box>
                                    <Avatar
                                        size={'md'}
                                        src={user.picture}
                                    />
                                </Box>
                                <Box>
                                    <h2 data-testid="profile-name">{user.name}</h2>
                                    <p className="lead text-muted" data-testid="profile-email">
                                        {user.email}
                                    </p>
                                </Box>
                            </Flex>
                            <Box>
                                <Code>{JSON.stringify(user, null, 2)}</Code>
                            </Box>
                        </>
                    )}
                </Layout>
            </MenuContextProvider>
        </GrantsContextProvider>
    );
}

export default withPageAuthRequired(Profile, {
    onRedirecting: () => <Loading />,
    onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
