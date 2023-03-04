import React from 'react';
import Head from 'next/head';
import TimeLine from '../components/TimeLine';
import {getBlocksBackend} from '../db/model';
import Layout from '../components/Layout';
import {GrantsContextProvider} from '../context/auth.context';
import {ModelContextProvider} from '../context/model.context';
import {MenuContextProvider} from '../context/menu.context';
import {getSession, useAuth0, getAccessToken} from '@auth0/nextjs-auth0';
import config from '../startup/config';
import {useUser} from "@auth0/nextjs-auth0/client";
import theme, {themeConfig} from "../startup/theming";
import {ColorModeScript, DarkMode, useColorMode} from "@chakra-ui/react";

export async function getServerSideProps(context) {
    try {
        let accessToken = null;
        let session = null;
        try {
            accessToken = await getAccessToken(context.req, context.res);
            console.log("AT:", accessToken);
            if (accessToken) {
                session = await getSession(context.req, {});
            }
        } catch (error) {

        }
        const {model, prevPageData, numPrevPage} = await getBlocksBackend(0, session);
        return {
            props: {model, prevPageData, numPrevPage},//session?.user || null},//, logout: !session}, // will be passed to the page component as props
            // props: {model, prevPageData, numPrevPage}, // will be passed to the page component as props
        }
    } catch (error) {
        console.log("!!!!!!!", error);
        return {
            props: {logout: true}, // will be passed to the page component as props
        }
    }
}

export default function Index({model, prevPageData, numPrevPage}) {
    return (
        // isLoading ? null :
        <GrantsContextProvider>
            <ModelContextProvider _model={model}>
                <MenuContextProvider>
                    <Layout>
                        <Head>
                            <title>{config.metaIndex.title}</title>
                            <meta name="description" content={config.metaIndex.description}/>
                            <meta name="keywords" content={config.metaIndex.keywords}/>
                            <meta name="robots" content={config.metaIndex.robots}/>
                        </Head>
                        <TimeLine paging={{prevPageData, numPrevPage}}/>
                    </Layout>
                </MenuContextProvider>
            </ModelContextProvider>
        </GrantsContextProvider>
    );
}
