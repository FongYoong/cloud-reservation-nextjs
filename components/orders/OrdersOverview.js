import { memo } from 'react';
import { MotionBox } from '../MotionElements';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { Player, Youtube } from '@vime/react';
import '@vime/core/themes/default.css';

export default memo(function OrdersOverview({ fetchingOrders, ordersList}) {
    return (
        <MotionBox
            flex={5}
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
                <Box width="60%" >
                    <Player controls >
                        <Youtube videoId="cUSVfImfAD8" />
                    </Player>
                </Box>
            </VStack>
        </MotionBox>
    )
});