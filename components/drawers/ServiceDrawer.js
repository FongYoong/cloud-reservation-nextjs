import { motion } from "framer-motion";
import { MotionButton, MotionBox } from '../MotionElements';
import { Box, VStack, Divider, Heading } from '@chakra-ui/react';
import { IoIosAddCircleOutline, IoMdAnalytics } from 'react-icons/io';
import { MdModeEdit, MdWork, MdDelete } from 'react-icons/md';


export default function ServiceDrawer({isOwner, serviceName, serviceMode, setServiceMode, drawerState, deleteHandler=()=>{}}) {
    const clickHandler = (mode) => {
        setServiceMode(mode);
        drawerState.onClose();
    }
    return (
        <MotionBox flex={1} minWidth={0} whileHover={{ scale: 1.1 }} >
            <VStack w='100%' m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading w='100%' fontSize="xl" mb={2} overflowWrap='break-word' >
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
        </MotionBox>
    )
}