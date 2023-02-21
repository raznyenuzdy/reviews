import { Flex, Box, Link, Spacer, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Blocks from './Blocks';
import { useModelContext } from '../context/model.context';
import config from '../startup/config';
import { key } from '../utils/utils';

const TimeLine = ({ paging }) => {

    const { state } = useModelContext();

    const { prevPageData, numPrevPage, pageData, numPage, nextPageData, numNextPage } = paging || {};

    return (<>
        <Blocks />
        {(!state.scrollable) ?
            <VStack w='100%'>
                <Flex w='100%' direction='row' justifyContent={'center'}>{pageData?.linkname || 'Page'}({numPage})</Flex>
                <Flex w='100%' direction='row'>
                    <Link alt={config.indexPageLinkAlt} href='/'>{config.indexPageLinkName}</Link>
                    {!nextPageData ? <Spacer /> :
                        <><Spacer /><Link alt={nextPageData?.linkalt || nextPageData?.linkname} href={nextPageData?.name}>{nextPageData?.linkname || 'newer'}({nextPageData.id}|{numNextPage})</Link></>}
                    {!prevPageData ? <><Spacer />no more</>  :
                        <><Spacer /><Link alt={prevPageData?.linkalt || prevPageData?.linkname} href={prevPageData?.name}>{prevPageData?.linkname || 'older'}({prevPageData.id}|{numPrevPage})</Link></>}
                </Flex>
            </VStack> : null}
    </>
    );
}

export default TimeLine;
