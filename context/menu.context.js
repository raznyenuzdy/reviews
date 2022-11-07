import { createContext, useContext, useState, useEffect } from "react";
import { getBlocks } from '../db/model2';
import { useGrantsContext } from './auth.context';

export const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
    const [showDeleted, setShowDeleted] = useState(false);
    const [adminMenu, setAdminMenu] = useState(null);
    const [editing, setEditing] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(null);
    const [reviewForm, setReviewForm] = useState({});
    // const editing = null;
    const [menu, setMenu] = useState({adminMenu, setAdminMenu, showReviewForm, setShowReviewForm, showDeleted, setShowDeleted, editing, setEditing, reviewForm, setReviewForm});

    return (
        <MenuContext.Provider value={{menu, setMenu}}>
            {children}
        </MenuContext.Provider>)
}


export function useMenuContext() {
    return useContext(MenuContext);
}