import {createContext, useContext} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

export const GrantsContext = createContext({});

export const GrantsContextProvider = ({children}) => {

    const { user, error, isLoading } = useUser();

    const boss = ['admin', 'moder'].find(v => v && v === user?.user_metadata?.role);

    const orgType = 'org' === user?.user_metadata?.role;

    const _user = !!user && !user.user_metadata?.role //&& !boss && !org;
    console.log("USERROLE:", _user);
    const grants = !!user ? {...user, role:user?.user_metadata?.role} : null;

    return (
        <GrantsContext.Provider value={{grants, boss, userType:_user, orgType, role:user?.user_metadata?.role}}>
            {children}
        </GrantsContext.Provider>)
}


export function useGrantsContext() {
    return useContext(GrantsContext);
}
