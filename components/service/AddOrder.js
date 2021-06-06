import { useState } from 'react';
import { useRouter } from 'next/router';
import { addNewOrder } from '../../lib/db';
import { MotionBox, MotionGetAttention } from '../MotionElements';
import OrderForm from '../forms/OrderForm';
import { useBreakpointValue, Flex, useToast, Box, Text, VStack, Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    CircularProgress,
} from '@chakra-ui/react';
import { MdNavigateNext } from 'react-icons/md';

export default function AddOrder({auth, serviceId, serviceData}) {
    const router = useRouter();
    const [creatingModal, setCreatingModal] = useState(false);
    const toast = useToast();

    const completeFormHandler = (data) => {
        setCreatingModal(true);
        addOrderToFirebase(data);
    }
    const addOrderToFirebase = (data) => {
        addNewOrder(auth, serviceId, serviceData.name, serviceData.type, serviceData.ownerId, {
            ...data,
            calendarEvents: data.calendarEvents.map((event) => {
                return {
                    ...event,
                    start: event.start.getTime(),
                    end: event.end.getTime(),
                }
            }).sort((a, b) => {
                if (a.start < b.start) {
                    return -1;
                }
                if (a.start > b.start) {
                    return 1;
                }
                return 0;
            }),
        },
        (orderId) => {
            // Success
            console.log("Firebase Success");
            toast({
                title: `Succesfully created order!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setTimeout(() => router.push(`/orders/${serviceId}/${orderId}`), 500);
        },
        () => {
            alert("Firebase Error");
        });
    }
    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });

    return (
        <MotionBox
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <Box position='relative'>
                <OrderForm update={false} serviceType={serviceData.type} serviceData={serviceData} completeFormHandler={completeFormHandler} />
                {!auth &&
                    <Flex py={16} align='center' justify='center' position='absolute' top='0' left='0' width='100%' height='100%' zIndex='50' __css={{
                        backdropFilter: 'blur(2px)',
                    }} >
                        <VStack p={8} bgGradient="linear(to-r, #cc2b5e, #753a88)" borderRadius="lg" >
                            <Text color='white' textAlign='center' fontSize={breakpoint==='base'?'lg':'2xl'} lineHeight='normal' fontWeight="bold" >
                                Please login or register to continue.
                            </Text>
                            <MotionGetAttention attentionType='expand' >
                            <Button mt={4} rightIcon={<MdNavigateNext />} size='lg' colorScheme={"linkedin"} onClick={() => { router.push('/login'); }} >
                                Give it a try?
                            </Button>
                            </MotionGetAttention>
                        </VStack>
                    </Flex>
                }
            </Box>
            <Modal motionPreset="scale" closeOnOverlayClick={false} closeOnEsc={false} isCentered={true} isOpen={creatingModal} onClose={() => {setCreatingModal(false)}}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Creating order...</ModalHeader>
                    <ModalBody>
                        <Flex align="center" justify="center">
                            <CircularProgress isIndeterminate color="green.400" />
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </MotionBox>
    )
}