import React from 'react';
import TimeLine from '../components/TimeLine';
import { getBlocks } from '../db/model2';

export async function getServerSideProps(context) {
    const model = await getBlocks();
    return {
        props: {model}, // will be passed to the page component as props
    }
}

export default function Index({model}) {
    console.log(model)
    return (
        <TimeLine model={model}/>
    );
}
