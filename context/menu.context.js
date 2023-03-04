import { createContext, useContext, useState, useEffect } from "react";

export const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
    const [showDeleted, setShowDeleted] = useState(false);
    const [adminMenu, setAdminMenu] = useState(null);
    const [editing, setEditing] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(null);
    const [reviewForm, setReviewForm] = useState({});
    const [adForm, setAdForm] = useState(false);
    const [adUserForm, setAdUserForm] = useState(false);
    const [replyForm, setReplyForm] = useState({});
    const [adminMenuComment, setAdminMenuComment] = useState(null);
    const [blockAccordionOpener, setBlockAccordionOpener] = useState([]);
    const [commentAccordionOpener, setCommentAccordionOpener] = useState([]);
    // const editing = null;
    const [menu, setMenu] = useState({
        adminMenu,
        setAdminMenu,
        adminMenuComment,
        setAdminMenuComment,
        showReviewForm,
        setShowReviewForm,
        showDeleted,
        setShowDeleted,
        editing,
        setEditing,
        reviewForm,
        setReviewForm,
        replyForm,
        setReplyForm,
        blockAccordionOpener,
        setBlockAccordionOpener,
        commentAccordionOpener,
        setCommentAccordionOpener,
    });

    return (
        <MenuContext.Provider value={{menu, setMenu, adForm, setAdForm, adUserForm, setAdUserForm}}>
            {children}
        </MenuContext.Provider>)
}


export function useMenuContext() {
    return useContext(MenuContext);
}
