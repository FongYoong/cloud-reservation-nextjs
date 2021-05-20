import { motion } from "framer-motion";
import { MotionButton } from '../MotionElements';
import { Box, VStack, Divider, Heading } from '@chakra-ui/react';
import { IoIosAddCircleOutline, IoMdAnalytics } from 'react-icons/io';
import { MdWork } from 'react-icons/md';


export default function ServicesDrawer({serviceMode, setServiceMode, drawerState}) {
    const clickHandler = (serviceType) => {
        setServiceMode(serviceType);
        drawerState.onClose();
    }
    return (
        <Box flex={1} >
            <motion.div whileHover={{ scale: 1.1 }} >
                <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                    <Heading fontSize="xl" mb={2}>
                        Services
                    </Heading>
                    <Divider />
                    <MotionButton icon={<IoIosAddCircleOutline />} colorScheme={serviceMode === 'add'?"purple":"gray"} onClick={() => clickHandler('add')} >
                        Add Service
                    </MotionButton>
                    <MotionButton icon={<IoMdAnalytics />} colorScheme={serviceMode === 'overview'?"purple":"gray"} onClick={() => clickHandler('overview')} >
                        Overview
                    </MotionButton>
                    <MotionButton icon={<MdWork />} colorScheme={serviceMode === 'all'?"purple":"gray"} onClick={() => clickHandler('all')} >
                        All Services
                    </MotionButton>
                </VStack>
            </motion.div>
        </Box>
    )
}