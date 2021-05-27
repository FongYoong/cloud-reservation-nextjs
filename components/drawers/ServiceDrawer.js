import { motion } from "framer-motion";
import { MotionButton } from '../MotionElements';
import { Box, VStack, Divider, Heading } from '@chakra-ui/react';
import { IoIosAddCircleOutline, IoMdAnalytics } from 'react-icons/io';
import { MdModeEdit, MdWork, MdDelete } from 'react-icons/md';


export default function ServiceDrawer({isOwner, serviceName, serviceMode, setServiceMode, drawerState, deleteHandler=()=>{}}) {
    const clickHandler = (mode) => {
        setServiceMode(mode);
        drawerState.onClose();
    }
    return (
        <Box flex={1} >
            <motion.div whileHover={{ scale: 1.1 }} >
                <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                    <Heading fontSize="xl" mb={2}>
                        {serviceName}
                    </Heading>
                    <Divider />
                    { isOwner &&
                    <MotionButton icon={<MdModeEdit />} colorScheme={serviceMode === 'edit'?"purple":"gray"} onClick={() => clickHandler('edit')} >
                        Edit Service
                    </MotionButton>
                    }
                    { !isOwner &&
                    <MotionButton icon={<IoIosAddCircleOutline />} colorScheme={serviceMode === 'addOrder'?"purple":"gray"} onClick={() => clickHandler('addOrder')} >
                        Add Order
                    </MotionButton>
                    }
                    <MotionButton icon={<IoMdAnalytics />} colorScheme={serviceMode === 'overview'?"purple":"gray"} onClick={() => clickHandler('overview')} >
                        Overview
                    </MotionButton>
                    { isOwner &&
                    <MotionButton icon={<MdWork />} colorScheme={serviceMode === 'allOrders'?"purple":"gray"} onClick={() => clickHandler('allOrders')} >
                        All Orders
                    </MotionButton>
                    }
                    { isOwner &&
                    <MotionButton icon={<MdDelete />} colorScheme="red" onClick={deleteHandler} >
                        Delete Service
                    </MotionButton>
                    }
                </VStack>
            </motion.div>
        </Box>
    )
}