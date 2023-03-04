import { useLayoutEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import Review from "./comments/Review";

const Sticky = ({ children, offsetTop = 0, ...rest }) => {
    const [isSticky, setIsSticky] = useState(false);
    const [top, setTop] = useState(0);

    useLayoutEffect(() => {
        const handleScroll = () => {
            setTop(document.querySelector('#sticky').getBoundingClientRect().top + window.pageYOffset);
        };

        const handleResize = () => {
            setTop(document.querySelector('#sticky').getBoundingClientRect().top + window.pageYOffset);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useLayoutEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.pageYOffset > top - offsetTop);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [top, offsetTop]);

    return (
        <Box
            id="sticky"
            position={isSticky ? 'fixed' : 'static'}
            top={offsetTop}
            w="100%"
            {...rest}
        >
            {children}
        </Box>
    );
};

export default Sticky;
