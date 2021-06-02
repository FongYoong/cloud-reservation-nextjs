import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { MotionButton, MotionBox } from '../MotionElements';
import { VStack, Divider, Heading } from '@chakra-ui/react';
import { IoMdAnalytics } from 'react-icons/io';
import { MdWork } from 'react-icons/md';

export default function OrdersDrawer({orderMode, setOrderMode, drawerState}) {
    const router = useRouter();
    
    const clickHandler = (orderType) => {
        setOrderMode(orderType);
        router.replace({
                pathname: router.pathname,
                query: { [orderType]: '' }
            }, 
            undefined, { shallow: true }
        );
        drawerState.onClose();
    }
    return (
        <MotionBox flex={1} whileHover={{ scale: 1.1 }} >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading fontSize="xl" mb={2}>
                    My Orders
                </Heading>
                <Divider borderColor='black.300' />
                <MotionButton icon={<IoMdAnalytics />} colorScheme={orderMode === 'overview'?"purple":"gray"} onClick={() => clickHandler('overview')} >
                    Overview
                </MotionButton>
                <MotionButton icon={<MdWork />} colorScheme={orderMode === 'all'?"purple":"gray"} onClick={() => clickHandler('all')} >
                    All Orders
                </MotionButton>
            </VStack>
        </MotionBox>
    )
}