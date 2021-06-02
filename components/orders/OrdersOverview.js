import { MotionBox } from '../MotionElements';
import { ScaleFade, Box, VStack, Button, Heading } from '@chakra-ui/react';
import { IoIosAddCircleOutline } from 'react-icons/io';

export default function OrdersOverview() {
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
                <Heading fontSize="xl" mb={2}>
                    OrdersOverview
                </Heading>
                <Button leftIcon={<IoIosAddCircleOutline />} colorScheme="teal" onClick={() => {}}>
                    OrdersOverview
                </Button>

            </VStack>
        </MotionBox>
    )
}