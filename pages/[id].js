import React from 'react';
import Head from 'next/head';
import TimeLine from '../components/TimeLine';
import {getPages} from '../db/model';
import Layout from '../components/Layout';
import {ModelContextProvider} from '../context/model.context';
import {MenuContextProvider} from '../context/menu.context';
import config from '../startup/config';
import inter from '../startup/inter';

let paging = [];

export async function getAllPageIds() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/page`
        );
        const responseData = await response.json();
        return responseData.map((page) => {
            paging.push[page];
            return {
                params: {
                    name: page.id.toString(),//+'_'+page.name
                    id: page.name
                }
            }
        })
    } catch (error) {
        throw error;
    }
}

export async function getStaticProps({ params }) {
    try {
        const paths = await getAllPageIds();
        const id = paths.find(p => p.params.id === params.id).params.name;
        const postData = await getPages(id);
        return {
            props: {postData}, // will be passed to the page component as props
        }
    } catch (error) {
        throw error
    }
}

export async function getStaticPaths() {
    try {
        const paths = await getAllPageIds();
        inter.set('paths', paths);
        return {
            paths,
            fallback: true,
        }
    } catch (error) {
        console.log(error);
    }
}

export default function Page({ postData }) {
    if (!postData?.pageData) return;
    const {prevPageData, pageData, nextPageData, numPrevPage, numPage, numNextPage} = postData?.pageData;
    return (
        <MenuContextProvider>
            <ModelContextProvider _model={postData?.model || {}} scroll={false}>
                <Layout>
                    <Head>
                        <title>{pageData?.title || config.robotsIndex.title}</title>
                        <meta name="description" content={pageData?.description || config.robotsIndex.description} />
                        <meta name="keywords" content={pageData?.keywords || config.robotsIndex.keywords} />
                        <meta name="robots" content={pageData?.robots || config.robotsIndex.robots} />
                    </Head>
                    <TimeLine paging={{prevPageData, pageData, nextPageData, numPrevPage, numPage, numNextPage}} />
                </Layout>
            </ModelContextProvider>
        </MenuContextProvider>
    );
}
