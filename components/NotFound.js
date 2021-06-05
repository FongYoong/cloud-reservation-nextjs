import { memo } from 'react';
import { Zoom } from "react-awesome-reveal";
import { Heading, VStack } from '@chakra-ui/react';

export default memo(function NotFound({text = 'Not found!'}) {
    return (
        <Zoom>
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading fontSize="xl" mb={2}>
                    {text}
                </Heading>
            </VStack>
        </Zoom>
    )
});