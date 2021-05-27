import { Flex, Heading, CircularProgress } from '@chakra-ui/react';

export default function Searching({text = 'Searching...'}) {
    return (
        <Flex align="center" justify="center">
            <Heading fontSize="xl" mb={2}>
                {text}
            </Heading>
            <CircularProgress isIndeterminate color="green.400" />
        </Flex>
    )
}