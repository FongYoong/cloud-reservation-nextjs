import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSignature, uploadImages, uploadVideo, addNewService } from '../../lib/db';
import { MotionBox } from '../MotionElements';
import ServiceForm from '../forms/ServiceForm';
import { Flex, useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    CircularProgress,
    CircularProgressLabel,
} from '@chakra-ui/react';

export default function AddService({auth}) {
    const router = useRouter();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingModal, setUploadingModal] = useState(false);
    const toast = useToast();

    const completeFormHandler = (data) => {
        setUploadingModal(true);
        getSignature((credentials) => {
            console.log(credentials);
            uploadImages(credentials, data.imageFiles,
            (progressValue) => {
                setUploadProgress((previousValue) => Math.round(previousValue + progressValue * 0.5));
            }, (imageUrls) => {
                console.log('uploaded images');
                console.log(imageUrls);
                uploadVideo(credentials, data.videoFile[0] ? data.videoFile[0] : null,
                (progressValue) => {
                    setUploadProgress(Math.round(progressValue * 0.5));
                }, (videoUrl) => {
                    console.log('uploaded video');
                    console.log(videoUrl);
                    addServiceToFirebase(data, imageUrls, videoUrl);
                })
            })
        });
    }
    const addServiceToFirebase = (data, imageUrls, videoUrl) => {
        const temp = {};
        if (data.serviceType === 'service') {
            temp['minPrice'] = parseFloat(data.details.minPrice.toFixed(2));
            temp['maxPrice'] = parseFloat(data.details.maxPrice.toFixed(2));
            temp['availableDays'] = data.availableDays;
        }
        else {
            temp['price'] = parseFloat(data.details.price.toFixed(2));
        }
        addNewService(auth,
        {
            type: data.serviceType,
            name: data.details.name,
            description: data.details.description,
            ...temp,
            imageUrls,
            videoUrl
        },
        (serviceId) => {
            // Success
            console.log("Firebase Success");
            setUploadProgress(100);
            toast({
                title: `Succesfully created service!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            router.push(`/services/${serviceId}`);
        },
        () => {
            // Error
            alert("Firebase Error");
        });
    }

    return (
        <MotionBox
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
        <ServiceForm update={false} completeFormHandler={completeFormHandler} />
        <Modal motionPreset="scale" closeOnOverlayClick={false} closeOnEsc={false} isCentered={true} isOpen={uploadingModal} onClose={() => {setUploadingModal(false)}}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Creating service...</ModalHeader>
                <ModalBody>
                    <Flex align="center" justify="center">
                        <CircularProgress value={uploadProgress} color="green.400">
                            <CircularProgressLabel>{uploadProgress}%</CircularProgressLabel>
                        </CircularProgress>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
        </MotionBox>
    )
}