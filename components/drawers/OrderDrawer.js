import { memo } from 'react';
import { useRouter } from 'next/router';
import { motion } from "framer-motion";
import { MotionButton, MotionBox } from '../MotionElements';
import { useColorModeValue, Box, Button, Tooltip, VStack, Divider, Text } from '@chakra-ui/react';
import { IoMdAnalytics } from 'react-icons/io';

export default memo(function OrderDrawer({isServiceOwner, serviceName, serviceType, serviceId, orderId, orderMode, setOrderMode, drawerState}) {
    const router = useRouter();

    const clickHandler = (mode) => {
        setOrderMode(mode);
        router.replace({
                pathname: `${serviceId}/${orderId}`,
                query: { [mode]: '' }
            }, 
            undefined, { shallow: true }
        );
        drawerState.onClose();
    };
    const bg1 = useColorModeValue("pink.200", "pink.500");

    return (
        <MotionBox flex={1} minWidth={0} whileHover={{ scale: 1.1 }} >
            <VStack w='100%' m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Tooltip placement="top" hasArrow label={`View ${serviceType === 'service' ? 'Service':'Product'}`} >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >
                        <Button lineHeight='normal' noOfLines={2} colorScheme="green" fontSize="lg" isTruncated onClick={ () => router.push(`/services/${serviceId}`) }>
                            {serviceName}
                        </Button>
                    </motion.div>
                </Tooltip>
                <Tooltip placement="bottom" hasArrow label="Order ID" >
                    <Box p={1} textAlign="center" width="100%" bg={bg1} borderRadius="lg">
                        <Text as="b" fontSize="md" isTruncated >
                            {orderId}
                        </Text>
                    </Box>
                </Tooltip>
                <Divider borderColor='black.300' />
                <MotionButton icon={<IoMdAnalytics />} colorScheme={orderMode === 'status'?"purple":"gray"} onClick={() => clickHandler('status')} >
                    Status
                </MotionButton>
            </VStack>
        </MotionBox>
    )
});