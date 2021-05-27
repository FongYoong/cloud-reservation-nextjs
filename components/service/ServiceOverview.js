import { motion } from "framer-motion";
import { ScaleFade, Box, VStack, Button, Heading } from '@chakra-ui/react';
import { IoIosAddCircleOutline } from 'react-icons/io';

export default function ServiceOverview() {
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
            </VStack>
        </motion.div>
    )
}