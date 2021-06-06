import { memo } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

export default memo(function Loading() {
    return (
        <Flex p={8} align="center" justify="center">
            <Spinner size="lg" />
        </Flex>
    )
});