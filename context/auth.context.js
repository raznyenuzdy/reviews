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

    const state = { grants, isLoading, isAuthenticated, grantsLoading, setGrantsState };

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
            console.log('??????????????', grants);
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
                console.log(error);
                ErrorResponseToaster({message: [error]});
                logout({returnTo: window.location.origin,});
                return;
            }
            // const token = await getAccessTokenSilently();
            console.log("Let's check token:", grants);
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
                console.log("Grants was already known: ", grants.role);
                return;
            }
            const response = await fetch(
                `http://localhost:5000/api/user/${grants.sub}`,
                options
            );
            const responseData = await response.json();
            console.log('!!!!!!!', responseData);
            switch (response.status) {
                case 200:
                    grants.hash = responseData.hash ? responseData.hash : null;
                    grants.role = responseData.role ? responseData.role : null;
                    // grants.role = 'admin';
                    const boss = ['admin', 'moder'].find(v => v === grants?.role);
                    setGrantsState(grants);
                    break;
                case 400:
                    ErrorResponseToaster(responseData);
                    break;
                case 401:
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