import { memo, useState } from 'react';
import { getSignature, uploadImages, updateProfile } from '../../lib/db';
import { MotionBox } from '../MotionElements';
import ProfileForm from '../forms/ProfileForm';
import { Flex, useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    CircularProgress,
    CircularProgressLabel,
} from '@chakra-ui/react';

export default memo(function EditProfile({auth, profileData}) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingModal, setUploadingModal] = useState(false);
    const toast = useToast();
    const completeFormHandler = (data) => {
        setUploadingModal(true);
        getSignature((credentials) => {
            console.log(credentials);
            uploadImages(credentials, data.imageFile,
            (progressValue) => {
                setUploadProgress((previousValue) => Math.round(previousValue + progressValue));
            }, (imageUrls) => {
                console.log('uploaded image');
                console.log(imageUrls);
                updateProfileToFirebase(data.username, data.description, imageUrls && imageUrls.length > 0 ? imageUrls[0] : '');
            })
        });
    }
    const updateProfileToFirebase = (username, description, imageUrl) => {
        updateProfile(auth, {
            username,
            description,
            profile_picture: imageUrl
        },
        () => {
            // Success
            console.log("Firebase Success");
            setUploadProgress(100);
            toast({
                title: `Succesfully updated profile!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setUploadingModal(false);
            setUploadProgress(0);
        },
        () => {
            // Error
            alert("Firebase Error");
        });
    }

    return (
        <MotionBox
            width='100%'
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <ProfileForm completeFormHandler={completeFormHandler}
                initialUsername={profileData.username}
                initialDescription={profileData.description}
                initialImageFile={profileData.profile_picture ? [{
                    source: profileData.profile_picture,
                    options: {
                        type: "local"
                    }
                }] : []} />
            <Modal motionPreset="scale" closeOnOverlayClick={false} closeOnEsc={false} isCentered={true} isOpen={uploadingModal} onClose={() => {setUploadingModal(false)}}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Updating profile...</ModalHeader>
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
});