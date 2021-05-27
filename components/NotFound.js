import { ScaleFade, Heading, VStack } from '@chakra-ui/react';

export default function NotFound({text = 'Not found!'}) {
    return (
        <ScaleFade initialScale={0.9} in={true}>
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading fontSize="xl" mb={2}>
                    {text}
                </Heading>
            </VStack>
        </ScaleFade>
    )
}