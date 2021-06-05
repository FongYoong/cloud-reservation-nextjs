import { memo } from 'react';
import { useRouter } from 'next/router';
import { MotionButton, MotionBox } from '../MotionElements';
import { VStack, Divider, Heading, Tag, TagRightIcon, TagLabel } from '@chakra-ui/react';
import { IoIosAddCircleOutline, IoMdAnalytics } from 'react-icons/io';
import { MdModeEdit, MdWork, MdDelete, MdStars } from 'react-icons/md';
import { FaProductHunt, FaHammer } from 'react-icons/fa';

export default memo(function ServiceDrawer({isOwner, serviceId, serviceName, serviceType, serviceMode, setServiceMode, drawerState, deleteHandler=()=>{}}) {
    const router = useRouter();

    const clickHandler = (mode) => {
        setServiceMode(mode);
        router.replace({
                pathname: serviceId,
                query: { [mode]: '' }
            }, 
            undefined, { shallow: true }
        );
        drawerState.onClose();
    }
    return (
        <MotionBox flex={1} minWidth={0} whileHover={{ scale: 1.1 }} >
            <VStack w='100%' m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                {serviceType === 'service' ?
                <Tag minWidth='7em' size='sm' colorScheme="teal">
                    <TagLabel>Service</TagLabel>
                    <TagRightIcon as={FaHammer} />
                </Tag>
                :
                <Tag minWidth='7em' size='sm' colorScheme="pink">
                    <TagLabel>Product</TagLabel>
                    <TagRightIcon as={FaProductHunt} />
                </Tag>
                }
                <Heading textAlign="center" w='100%' fontSize="xl" mb={2} overflowWrap='break-word' >
                    {serviceName}
                </Heading>
                <Divider borderColor='black.300' />
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
                <MotionButton icon={<MdStars />} colorScheme={serviceMode === 'reviews'?"purple":"gray"} onClick={() => clickHandler('reviews')} >
                    Reviews
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
});