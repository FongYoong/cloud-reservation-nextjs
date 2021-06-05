import { memo } from 'react';
import { useRouter } from 'next/router';
import { MotionButton, MotionBox } from '../MotionElements';
import { VStack, Divider, Heading } from '@chakra-ui/react';
import { IoIosAddCircleOutline, IoMdAnalytics } from 'react-icons/io';
import { MdWork } from 'react-icons/md';

export default memo(function ServicesDrawer({serviceMode, setServiceMode, drawerState}) {
    const router = useRouter();

    const clickHandler = (serviceType) => {
        setServiceMode(serviceType);
        router.replace({
                pathname: router.pathname,
                query: { [serviceType]: '' }
            }, 
            undefined, { shallow: true }
        );
        drawerState.onClose();
    }
    return (
        <MotionBox flex={1} whileHover={{ scale: 1.1 }} >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading fontSize="xl" mb={2}>
                    My Services
                </Heading>
                <Divider borderColor='black.300' />
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
        </MotionBox>
    )
});