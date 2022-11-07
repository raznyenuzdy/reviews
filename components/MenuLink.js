import React from 'react';

import AnchorLink from './AnchorLink';

const MenuLink = ({ children, href, className, prefix, icon, tabIndex, testId }) => {
    return (
        <>
            <AnchorLink
                href={href}
                className={className}
                icon={icon}
                tabIndex={tabIndex}
                mr="12px"
                testId="testId">
                Log out!!
            </AnchorLink>
        </>
    );
};

export default AnchorLink;