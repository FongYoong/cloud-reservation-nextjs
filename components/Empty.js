import { memo } from 'react';
import Image from 'next/image';
import { Zoom } from "react-awesome-reveal";
import { VStack, Heading, Box } from '@chakra-ui/react';

export default memo(function Empty ({ children, ...props }) {
    return ( 
        <Zoom>
            <VStack p={2} w='100%'>
                <Heading textAlign='center' mb={2} fontSize="xl" {...props} > Wow, such empty... </Heading>
                <Box borderRadius='2xl' overflow="hidden" bg="white" lineHeight="0" >
                    <Image
                        width='400'
                        height='300'
                        src='/images/cat_hands.gif'
                        alt="Wow, such empty"
                    />
                </Box>
                {children}
            </VStack>
        </Zoom>
    )
});
/*
<Image
    layout="fill"
    objectFit="contain"
    src='/images/cat_hands.gif'
    alt="Wow, such empty"
/>
<Img
    borderRadius="lg"
    boxSize="20vh"
    src='/images/cat_hands.gif'
    alt="Wow, such empty"
/>
*/