import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import NavBarItem from './NavBarItem';
// import { useAuth0 } from '@auth0/auth0-react';
import { useGrantsContext } from "../context/auth.context";

const AnchorLogoutButton = ({ children, href, className, prefix, icon, tabIndex, testId, mr }) => {
    const { grants, grantsLoading, setGrantsState } = useGrantsContext();
    const { logout } = useAuth0();
    const logOff = () => {
        logout({returnTo: window.location.origin})
        setGrantsState(null);
    }

    return (
        <a onClick={() => logOff()}>
            <NavBarItem 
            className={className} 
            icon={icon} 
            tabIndex={tabIndex} 
            testId={testId} 
            mr={mr}>
                {children}
            </NavBarItem>
        </a>
    );
};

export default AnchorLogoutButton;
