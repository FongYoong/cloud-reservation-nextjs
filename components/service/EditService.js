import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSignature, uploadImages, uploadVideo, updateService } from '../../lib/db';
import { MotionBox } from '../MotionElements';
import ServiceForm from '../forms/ServiceForm';
import { Heading, Flex, useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    CircularProgress,
    CircularProgressLabel,
} from '@chakra-ui/react';

const getDetails = (data) => {
    const temp = {
        name: data.name,
        description: data.description,
    };
    if (data.type === 'service') {
        temp['minPrice'] = data.minPrice;
        temp['maxPrice'] = data.maxPrice;
    }
    else {
        temp['price'] = data.price;
    }
    return temp;
}

export default function EditService({auth, cannotModify, serviceId, publicData}) {
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
                    updateServiceToFirebase(data, imageUrls, videoUrl);
                })
            })
        });
    }
    const updateServiceToFirebase = (data, imageUrls, videoUrl) => {
        const temp = {};
        if (data.serviceType === 'service') {
            temp['minPrice'] = data.details.minPrice;
            temp['maxPrice'] = data.details.maxPrice;
            temp['availableDays'] = data.availableDays;
        }
        else {
            temp['price'] = data.details.price;
        }
        updateService(auth, serviceId,
        {
            type: data.serviceType,
            name: data.details.name,
            description: data.details.description,
            ...temp,
            imageUrls,
            videoUrl
        },
        () => {
            // Success
            console.log("Firebase Success");
            setUploadProgress(100);
            toast({
                title: `Succesfully updated service!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            router.reload();
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
        {cannotModify ? <Heading textAlign='center' fontSize="lg" > This service already has orders so it cannot be modified. </Heading>
            : <>
            <ServiceForm update={true} completeFormHandler={completeFormHandler}
                initialServiceType={publicData.type}
                initialDetails={getDetails(publicData)}
                initialDays={publicData.availableDays ? publicData.availableDays : []}
                initialImageFiles={publicData.imageUrls ? publicData.imageUrls.map((url) => ({
                    source: url,
                    options: {
                        type: "local"
                    }
                })) : []}
                initialVideoFile={publicData.videoUrl ? [{
                    source: publicData.videoUrl,
                    options:{
                        type: "local"
                    }
                }] : []} />
            <Modal motionPreset="scale" closeOnOverlayClick={false} closeOnEsc={false} isCentered={true} isOpen={uploadingModal} onClose={() => {setUploadingModal(false)}}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Updating service...</ModalHeader>
                    <ModalBody>
                        <Flex align="center" justify="center">
                            <CircularProgress value={uploadProgress} color="green.400">
                                <CircularProgressLabel>{uploadProgress}%</CircularProgressLabel>
                            </CircularProgress>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
            </>
        }
        </MotionBox>
    )
}