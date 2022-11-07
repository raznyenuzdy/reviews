import { createContext, useContext, useState, useEffect } from "react";
import { getBlocks } from '../db/model2';
import { useGrantsContext } from './auth.context';

export const ModelContext = createContext({});

export const ModelContextProvider = ({ children }) => {
    const [page, setPage] = useState(0);
    const [model, setModel] = useState([]);
    const [modelLoading] = useState(false);
    const {grants, isLoading} = useGrantsContext();
    const [state, setState] = useState({ model, setModel, modelLoading, page, setPage });

/*
    useEffect(() => {
        if (isLoading) return;
        const fetchData = async () => {
            const model = await getBlocks(grants, page);
            setModel(model);
            state.model = model;
            setState(state);
        }
        fetchData().catch(console.error);
    }, [page, isLoading, grants]);
*/
    return (
        <ModelContext.Provider value={[state, setState]}>
            {children}
        </ModelContext.Provider>)
}


export function useModelContext() {
    return useContext(ModelContext);
}