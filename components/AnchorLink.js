import React from 'react';

import NavBarItem from './NavBarItem';

const AnchorLink = ({ children, href, className, prefix, icon, tabIndex, testId, mr }) => {
    return (
        <a href={href}>
            <NavBarItem href={href} className={className} icon={icon} tabIndex={tabIndex} testId={testId} mr={mr}>
                {children}
            </NavBarItem>
        </a>
    );
};

export default AnchorLink;
