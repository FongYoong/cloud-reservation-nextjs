import { motion } from "framer-motion";
import { MotionButton } from '../MotionElements';
import { useColorModeValue, Box, Button, Tooltip, VStack, Divider, Text } from '@chakra-ui/react';
import { IoMdAnalytics } from 'react-icons/io';

export default function ServiceDrawer({isServiceOwner, serviceName, serviceType, orderId, orderMode, setOrderMode, drawerState, rejectModalState={}}) {
    const clickHandler = (mode) => {
        setOrderMode(mode);
        drawerState.onClose();
    }
    const bg1 = useColorModeValue("cyan.200", "cyan.500");

    return (
        <Box flex={1} >
            <motion.div whileHover={{ scale: 1.1 }} >
                <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                    <Tooltip placement="top" hasArrow label={`View ${serviceType === 'service' ? 'Service':'Product'}`} >
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >
                            <Button colorScheme="green" fontSize="lg" isTruncated>
                                {serviceName}
                            </Button>
                        </motion.div>
                    </Tooltip>
                    <Tooltip placement="bottom" hasArrow label="Order ID" >
                        <Box p={1} textAlign="center" width="100%" bg={bg1} borderRadius="lg">
                            <Text as="b" fontSize="lg" isTruncated >
                                {orderId}
                            </Text>
                        </Box>
                    </Tooltip>
                    <Divider borderColor='black.500' />
                    <MotionButton icon={<IoMdAnalytics />} colorScheme={orderMode === 'status'?"purple":"gray"} onClick={() => clickHandler('status')} >
                        Status
                    </MotionButton>
                </VStack>
            </motion.div>
        </Box>
    )
}