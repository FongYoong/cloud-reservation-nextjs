import { memo } from 'react';
import { useRouter } from 'next/router';
import { MotionButton, MotionBox } from '../MotionElements';
import { VStack, Divider, Heading } from '@chakra-ui/react';
import { IoMdAnalytics } from 'react-icons/io';
import { MdModeEdit } from 'react-icons/md';

export default memo(function ServicesDrawer({mode, setMode, drawerState}) {
    const router = useRouter();

    const clickHandler = (type) => {
        setMode(type);
        router.replace({
                pathname: router.pathname,
                query: { [type]: '' }
            }, 
            undefined, { shallow: true }
        );
        drawerState.onClose();
    }
    return (
        <MotionBox flex={1} whileHover={{ scale: 1.1 }} >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading mb={2} textAlign='center' fontSize="3xl" fontWeight="extrabold" >
                    My Account
                </Heading>
                <Divider borderColor='black.300' />
                <MotionButton icon={<MdModeEdit />} colorScheme={mode === 'edit'?"purple":"gray"} onClick={() => clickHandler('edit')} >
                    Edit Profile
                </MotionButton>
                <MotionButton icon={<IoMdAnalytics />} colorScheme={mode === 'overview'?"purple":"gray"} onClick={() => clickHandler('overview')} >
                    Overview
                </MotionButton>
            </VStack>
        </MotionBox>
    )
});