import { memo } from 'react';
import Image from 'next/image';
import { MotionBox } from '../MotionElements';
import { VStack, Heading, Text, Box } from '@chakra-ui/react';

export default memo(function OrdersOverview({ fetchingOrders, ordersList}) {
    return (
        <MotionBox
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading fontSize="xl" m={2}>
                    Overview
                </Heading>
                <Text fontSize="lg" m={2}>
                    This section is supposed to display some stats about your orders but the developer is too lazy to code something here.
                    After all, who would want to see a summary of everything they&apos;ve bought without feeling guilty for overspending?
                    <span role='img' aria-label='Grin' >😁</span>
                </Text>
                <Box borderRadius="full" overflow="hidden" bg="white" lineHeight="0" >
                    <Image
                        priority={true}
                        width='150'
                        height='150'
                        src={'/images/sleeping.gif'}
                        alt={'Lazy'}
                    />
                </Box>
            </VStack>
        </MotionBox>
    )
});