import { createContext, useContext, useState, useEffect } from "react";
import {filterHiddenBlocks} from "../utils/utils";
export const ModelContext = createContext();
export const ModelContextProvider = ({ children, _model, scroll = true }) => {
    const [page, setPage] = useState(1);
    const [blocks, setBlocks] = useState(_model?.length || 0); //shown blocks at last scrolling
    const [scrollable, setScrollable] = useState(scroll);
    const [model, setModel] = useState(_model);
    const [state, setState] = useState({ model, setModel, page, scrollable, setScrollable, setPage, blocks, setBlocks });

    const updateModel = (newModel) => {
        setState(prevState => ({
            ...prevState,
            model: newModel,
        }));
    };

    const addBlock = (block) => {
        const blocks = [block].flat();
        setState(prevState => {
            const updatedModel = [...blocks, ...prevState.model];//еали block был массив и так
            return {
                ...prevState,
                model: updatedModel,
                blocks: (prevState.model.length || 0) + blocks.length || 0
            };
        });
    }

    const deleteBlock = (block, showDeleted) => {
        setState(prevState => {
            const i = prevState.model.findIndex(b => b.id === block.id);
            if (i < 0) return [...prevState.model];
            prevState.model.splice(i, 1);
            const updatedModel = [...prevState.model];
            return {
                ...prevState,
                model: updatedModel,
                blocks: prevState.model.filter(m => !m.deleted || showDeleted).length - 1
            }
        })
    }

    return (
        <ModelContext.Provider value={{state, updateModel, addBlock, deleteBlock, setState}}>
            {children}
        </ModelContext.Provider>)
}

export function useModelContext() {
    return useContext(ModelContext);
}
