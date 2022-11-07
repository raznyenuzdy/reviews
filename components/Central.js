import {
    Box,
    Container,
    Stack,
} from '@chakra-ui/react';

export default function Central({ children }) {
    return (
        <>
            <Container>
                <Stack as={Box} spacing={{ base: 8, md: 14 }}>
                    {children}
                </Stack>
            </Container>
        </>
    );
}
