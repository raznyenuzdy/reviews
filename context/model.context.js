import { createContext, useContext, useState, useEffect } from "react";
import { useGrantsContext } from './auth.context';

export const ModelContext = createContext();

export const ModelContextProvider = ({ children, _model, scroll = true }) => {
    const [page, setPage] = useState(1);
    const [blocks, setBlocks] = useState(_model?.length || 0); //shown blocks at last scrolling
    const [scrollable, setScrollable] = useState(scroll);
    const [model, setModel] = useState(_model);
    const [state, setState] = useState({ model, setModel, page, scrollable, setScrollable, setPage, blocks, setBlocks });

    return (
        <ModelContext.Provider value={{state, setState}}>
            {children}
        </ModelContext.Provider>)
}


export function useModelContext() {
    return useContext(ModelContext);
}
