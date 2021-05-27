import { motion } from "framer-motion";
import { ScaleFade, Box, VStack, Button, Heading } from '@chakra-ui/react';
import { IoIosAddCircleOutline } from 'react-icons/io';

export default function ServicesOverview() {
    return (
        <motion.div
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading fontSize="xl" mb={2}>
                    ServiceOverview
                </Heading>
                <Button leftIcon={<IoIosAddCircleOutline />} colorScheme="teal" onClick={() => {}}>
                    ServiceOverview
                </Button>

            </VStack>
        </motion.div>
    )
}