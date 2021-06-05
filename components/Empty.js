import { memo } from 'react';
import { Zoom } from "react-awesome-reveal";
import { VStack, Heading, Img } from '@chakra-ui/react';

export default memo(function Empty ({ children, ...props }) {
    return ( 
        <Zoom>
            <VStack p={2} w='100%'>
                <Heading mb={2} fontSize="xl" {...props} > Wow, such empty... </Heading>
                <Img
                    borderRadius="lg"
                    boxSize="20vh"
                    src='/images/cat_hands.gif'
                    alt="Wow, such empty"
                />
                {children}
            </VStack>
        </Zoom>
    )
});