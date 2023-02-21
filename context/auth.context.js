import {createContext, useContext} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

export const GrantsContext = createContext({});

export const GrantsContextProvider = ({children}) => {

    const { user, error, isLoading } = useUser();
console.log("USERROLE:", user, error, isLoading);
    const boss = ['admin', 'moder'].find(v => v && v === user?.user_metadata?.role);

    return (
        <GrantsContext.Provider value={{grants: user, boss}}>
            {children}
        </GrantsContext.Provider>)
}


export function useGrantsContext() {
    return useContext(GrantsContext);
}
