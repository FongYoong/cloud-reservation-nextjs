import { memo } from 'react';
import { Flex, Heading, CircularProgress } from '@chakra-ui/react';

export default memo(function Searching({text = 'Searching...'}) {
    return (
        <Flex p={8} align="center" justify="center">
            <Heading fontSize="xl" mb={2}>
                {text}
            </Heading>
            <CircularProgress isIndeterminate color="green.400" />
        </Flex>
    )
});