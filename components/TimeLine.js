import React, { useEffect } from 'react';
import Comments from './Comments';
import { useModelContext } from '../context/model.context';

const TimeLine = props => {
    const [ state, setState ] = useModelContext();

    useEffect(() => {
        if (state && typeof props.model === 'object' && Object.keys(props.model).length > 0) {
            state.model = props.model;
            state.setModel(props.model);
            setState(state);
        }
    }, [props.model])

    return (
        <Comments />
    );
}

export default TimeLine;
