import { useState } from 'react';
import { useRouter } from 'next/router';
import { addNewOrder } from '../../lib/db';
import { MotionBox } from '../MotionElements';
import OrderForm from '../forms/OrderForm';
import { Flex, useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    CircularProgress,
} from '@chakra-ui/react';

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

    return (
        <MotionBox
            flex={5}
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <OrderForm update={false} serviceType={serviceData.type} serviceData={serviceData} completeFormHandler={completeFormHandler} />
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