import { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import { AuthRole } from '../pages/clientAuth';
import { useToast } from '@chakra-ui/react';
import Joi from "joi";

export const GrantsContext = createContext({});

export const GrantsContextProvider = ({ children }) => {
    const { user, getAccessTokenSilently, error, isLoading, isAuthenticated, logout } = useAuth0();
    const [grants, setGrantsState] = useState({ ...user, role: "" });
    const [grantsLoading, setGrantsLoading] = useState(false);
    const toast = useToast();
    const boss = ['admin', 'moder'].find(v => v === grants?.role);
    const state = { grants, isLoading, isAuthenticated, grantsLoading, setGrantsState, boss };

    useEffect(() => {
        async function fetchData() {
            return new Promise(async (resolve) => {
                // user ? await proofRole() : setGrantsLoading(false);
                await AuthRole(user, setGrantsState, getAccessTokenSilently, isAuthenticated, logout);
                resolve();
            })
        }
        setGrantsLoading(true);
        fetchData().then(() => setGrantsLoading(false)).catch(console.error);
    }, [user]);

    const ErrorResponseToaster = (responseData) => {
        if (responseData.message) {
            if (Array.isArray(responseData.message)) {
                responseData.message.forEach(text => {
                    toast({
                        title: `${text}`,
                        status: `error`,
                        isClosable: true,
                    })
                }
                )
            } else {
                toast({
                    title: `${responseData.message}`,
                    status: `error`,
                    isClosable: true,
                })
            }
        }
    }

    const AuthRole = async (grants, setGrantsState, getAccessTokenSilently, isAuthenticated, logout) => {
        try {
            // what happens at parrent component as reaction on auth events
            // toast = callback;
            if (!isAuthenticated){
                return;
            }
            const schema = Joi.object({
                email: Joi.string().email({ tlds: { allow: false } }).required(),
                name: Joi.string().required(),
                role: Joi.string()
            });
            const body = { email: grants.email, name: grants.name, role: grants.role };
            const { error } = schema.validate(body);
            if (error) {
                ErrorResponseToaster({message: [error]});
                logout({returnTo: window.location.origin,});
                return;
            }
            // const token = await getAccessTokenSilently();
            grants.token = grants.token ? grants.token : await getAccessTokenSilently();
            const options = {
                headers: {
                    'Authorization': `Bearer ${grants.token}`,
                    'Content-type': 'application/json'
                },
                method: 'GET',
            }
            if (grants && !!grants.role) {
                //no sense to reauth right now, thus role known, anyway , if so, server will not proof..if so
                return;
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/user/${grants.sub}`,
                options
            );
            const responseData = await response.json();
            switch (response.status) {
                case 200:
                    grants.first_name ||= responseData.first_name || grants.given_name;
                    grants.last_name ||= responseData.last_name || grants.family_name;
                    grants.hash = responseData.hash ? responseData.hash : null;
                    grants.role = responseData.role ? responseData.role : null;
                    grants.id = responseData.id;
                    // grants.role = 'admin';
                    setGrantsState(grants);
                    break;
                case 400:
                    ErrorResponseToaster(responseData);
                    break;
                case 401:
                    logout();
                    ErrorResponseToaster(responseData);
                    break;
                case 404:
                    logout();
                    ErrorResponseToaster(responseData);
                    break;
                case 500:
                    // logout();
                    setGrantsState(null);
                    ErrorResponseToaster(responseData);
                    break;
                default:
                    break;
            }
        } catch (error) {
            ErrorResponseToaster({message: [error.message]});
        }
    };

    return (
        <GrantsContext.Provider value={state}>
            {children}
        </GrantsContext.Provider>)
}


export function useGrantsContext() {
    return useContext(GrantsContext);
}