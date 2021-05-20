import { useState, useRef } from 'react';

// File Pond
import { FilePond, File, registerPlugin } from 'react-filepond'; // Import React FilePond
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginMediaPreview from 'filepond-plugin-media-preview';
import 'filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType, FilePondPluginMediaPreview);

import { getSignature, uploadImages, uploadVideo } from '../../lib/db';
import { motion } from "framer-motion";
import { MotionButton } from '../MotionElements';
import { ScaleFade, useBreakpointValue, Box, Flex, Text, Stack, HStack, VStack, Button, Heading, UnorderedList, ListItem,
    Input,
    Textarea,
    FormControl,
    FormLabel,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react';
const MotionBox = motion(Box)
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { FaDotCircle } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { TiTickOutline } from 'react-icons/ti';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ServiceSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  minPrice: Yup.number().positive('Minimum must be positive').required('Required'),
  maxPrice: Yup.number().positive('Maximum must be positive').moreThan(Yup.ref('minPrice'), 'Specify a greater price').required('Required'),
});

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  price: Yup.number().positive('Price must be positive').required('Required'),
});

export default function AddService() {
    const formRef = useRef(null)
    const serviceTypeFlipRef = useRef();
    const [serviceType, setServiceType] = useState('service'); // service, product
    const serviceTypeVariants = {
        unselected: { scale: 1 },
        selected: { scale: 1.2 },
    };
    const initialFormVariants = {
        display: "none",
    }
    const formVariants = {
        right: {
            scale: [1, 0],
            x: [0, 1000],
            transition:{
                delay: 0,
                ease: "easeInOut",
                x: { type: "spring", stiffness: 200 },
            },
            transitionEnd: {
                display: "none",
            },
        },
        in: {
            display: 'block',
            scale: 1,
            x: 0,
            transition:{
                delay: 0.8,
                ease: "easeInOut",
                x: { type: "spring", stiffness: 200 },
            }
        },
        left: {
            scale: [1, 0],
            x: [0, -1000],
            transition:{
                delay: 0,
                ease: "easeInOut",
                x: { type: "spring", stiffness: 200 },
            },
            transitionEnd: {
                display: "none",
            },
        }
    };
    const [formState, setFormState] = useState(0);
    /*
    const formStates = {
        0: 'details',
        1: 'images',
        2: 'video,'
    }
    */

    const changeFormState = (change) => {
        //formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (formState < 2 || change === -1) {
            setFormState(formState + change);
        }
        else {
            getSignature((credentials) => {
                console.log(credentials);
                uploadImages(credentials, imageFiles.map((f) => f.file),
                () => {
                    // Progress
                    console.log("progress");
                }, (imageUrls) => {
                    console.log(imageUrls);
                    // Finish
                    uploadVideo(credentials, videoFile[0] ? videoFile[0].file : null,
                    (videoUrl) => {
                        alert('uploading done');
                        console.log(videoUrl);
                    })
                })
            });
        }
    }
    let detailsTrans, imagesTrans, videoTrans;
    if (formState === 0) {
        detailsTrans = 'in';
        imagesTrans = 'right';
        videoTrans = 'right';
    }
    if (formState === 1) {
        detailsTrans = 'left';
        imagesTrans ='in';
        videoTrans = 'right';
    }
    if (formState === 2) {
        detailsTrans = 'left';
        imagesTrans = 'left';
        videoTrans = 'in';
    }
    const [detailsConfirmed, setDetailsConfirmed] = useState(false);
    const [details, setDetails] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoFile, setVideoFile] = useState([]);
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

    return (
      
        <motion.div
            ref={formRef}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
        <Stack align={["center", "start"]} justify={["center", "space-between"]} direction={["column", "row"]} spacing="4"  m={2} p={4} borderWidth={2} borderRadius="lg" boxShadow="lg" >
            <ScaleFade in={formState!==0}>
                <MotionButton icon={<MdNavigateBefore />} variant="outline" colorScheme={"purple"}
                    onClick={() => {
                        changeFormState(-1);
                    }} >
                    Previous
                </MotionButton>
            </ScaleFade>
            <motion.div initial={false} variants={formVariants} animate={detailsTrans}>
                <VStack spacing="4" >
                    <HStack spacing="8">
                        <motion.div variants={serviceTypeVariants} animate={serviceType==='service'?'selected':'unselected'}>
                            <MotionButton icon={serviceType==='service' ? <FaDotCircle /> : <GoPrimitiveDot />} variant={serviceType==='service' ? "solid":"outline"} colorScheme={"blue"} onClick={() => {
                                if (serviceType==='product') serviceTypeFlipRef.current.toggle();
                                setServiceType('service');
                                setDetailsConfirmed(false);
                            }} >
                                Service
                            </MotionButton>
                        </motion.div>
                        <motion.div variants={serviceTypeVariants} animate={serviceType==='product'?'selected':'unselected'}>
                            <MotionButton icon={serviceType==='product' ? <FaDotCircle /> : <GoPrimitiveDot />} variant={serviceType==='product' ? "solid":"outline"} colorScheme={"blue"} onClick={() => {
                                if (serviceType==='service') serviceTypeFlipRef.current.toggle();
                                setServiceType('product');
                                setDetailsConfirmed(false);
                            }} >
                                Product
                            </MotionButton>
                        </motion.div>
                    </HStack>
                    <Flippy
                        flipOnHover={false}
                        flipOnClick={false}
                        flipDirection="horizontal"
                        ref={serviceTypeFlipRef}
                    >
                        <FrontSide style={{height:'100%', padding:0}}>
                            {/* Service details */}
                            <Formik
                                initialValues={{
                                    name: '',
                                    description: '',
                                    minPrice: 1,
                                    maxPrice: 2,
                                }}
                                validationSchema={ServiceSchema}
                                onSubmit={(values) => {
                                    setDetails(values);
                                    setDetailsConfirmed(true);
                                }}
                                >
                                {({errors, touched, handleChange}) => (
                                <Form
                                    onChange={e => {
                                        setDetailsConfirmed(false);
                                        handleChange(e);
                                    }}
                                >
                                    <VStack p={4} spacing={4} borderWidth={2} borderRadius="lg" boxShadow="lg">
                                    <Field name="name" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.name && touched.name} isRequired>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <Input {...field} id="name" placeholder="" />
                                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name="description" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.description && touched.description} isRequired>
                                        <FormLabel htmlFor="description">Description</FormLabel>
                                        <Textarea id="description" placeholder="Once upon a time..."  {...field} />
                                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name="minPrice" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.minPrice && touched.minPrice} isRequired>
                                        <FormLabel htmlFor="minPrice">Minimum Price per Hour</FormLabel>
                                        <NumberInput id="minPrice" defaultValue={1} min={0} precision={2} >
                                            <HStack>
                                                <Text>RM</Text>
                                                <NumberInputField {...field} />
                                            </HStack>
                                        </NumberInput>
                                        <FormErrorMessage>{errors.minPrice}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name="maxPrice" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.maxPrice && touched.maxPrice} isRequired>
                                        <FormLabel htmlFor="maxPrice">Maximum Price per Hour</FormLabel>
                                        <NumberInput id="maxPrice" defaultValue={2} min={0} precision={2} >
                                            <HStack>
                                                <Text>RM</Text>
                                                <NumberInputField {...field} />
                                            </HStack>
                                        </NumberInput>
                                        <FormErrorMessage>{errors.maxPrice}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                        <Button
                                            visibility={serviceType==='service'?"visible":"hidden"}
                                            isLoading={detailsConfirmed}
                                            spinner={<TiTickOutline />}
                                            mt={4}
                                            colorScheme="teal"
                                            type="submit"
                                        >
                                        Confirm
                                        </Button>
                                    </VStack>
                                </Form>
                                )}
                            </Formik>
                        </FrontSide>
                        <BackSide style={{padding:0}}>
                            {/* Product details */}
                            <Formik
                                initialValues={{
                                    name: '',
                                    description: '',
                                    price: 2,
                                }}
                                validationSchema={ProductSchema}
                                onSubmit={values => {
                                    setDetails(values);
                                    setDetailsConfirmed(true);                            }}
                                >
                                {({errors, touched, handleChange}) => (
                                <Form
                                    onChange={e => {
                                        setDetailsConfirmed(false);
                                        handleChange(e);
                                    }}
                                >
                                    <VStack p={4} spacing={4} borderWidth={2} borderRadius="lg" boxShadow="lg">
                                    <Field name="name" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.name && touched.name} isRequired>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <Input {...field} id="name" placeholder="" />
                                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name="description" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.description && touched.description} isRequired>
                                        <FormLabel htmlFor="description">Description</FormLabel>
                                        <Textarea id="description" placeholder="Once upon a time..."  {...field} />
                                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name="price" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.price && touched.price} isRequired>
                                        <FormLabel htmlFor="price">Price</FormLabel>
                                        <NumberInput id="price" defaultValue={2} min={0} precision={2} >
                                            <HStack>
                                                <Text>RM</Text>
                                                <NumberInputField {...field} />
                                            </HStack>
                                        </NumberInput>
                                        <FormErrorMessage>{errors.price}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Button
                                        visibility={serviceType==='product'?"visible":"hidden"}
                                        isLoading={detailsConfirmed}
                                        spinner={<TiTickOutline />}
                                        mt={4}
                                        colorScheme="teal"
                                        type="submit"
                                    >
                                    Confirm
                                    </Button>
                                    </VStack>
                                </Form>
                                )}
                            </Formik>
                        </BackSide>
                    </Flippy>
                </VStack>
            </motion.div>
            <MotionBox width="60%" initial={initialFormVariants} variants={formVariants} animate={imagesTrans} >
                <Flex align="center" justify="center" direction="column">
                    <Heading>
                        Images
                    </Heading>
                    <UnorderedList my={4}>
                        <ListItem>File size: <b>10 MB</b> maximum</ListItem>
                        <ListItem>Up to <b>5</b> images</ListItem>
                    </UnorderedList>
                    <Box width="100%">
                    <FilePond
                        files={imageFiles}
                        onupdatefiles={setImageFiles}
                        instantUpload={false}
                        acceptedFileTypes={['image/*']}
                        labelFileTypeNotAllowed='Only images are allowed'
                        fileValidateTypeLabelExpectedTypes=""
                        allowMultiple={true}
                        maxFiles={5}
                        maxFileSize='10MB'
                        name="images"
                        labelIdle='Drag & Drop your images here or <span class="filepond--label-action">Browse</span>'
                        credits={{}}
                    />
                    </Box>
                </Flex>
            </MotionBox>
            <MotionBox width="50%" initial={initialFormVariants} variants={formVariants} animate={videoTrans} >
                <Flex align="center" justify="center" direction="column">
                    <Heading>
                        Video
                    </Heading>
                    <UnorderedList my={4}>
                        <ListItem>File size: <b>50 MB</b> maximum</ListItem>
                    </UnorderedList>
                    <Box width="100%">
                        <FilePond
                            files={videoFile}
                            onupdatefiles={setVideoFile}
                            instantUpload={false}
                            acceptedFileTypes={['video/*']}
                            labelFileTypeNotAllowed='Only videos are allowed'
                            fileValidateTypeLabelExpectedTypes=""
                            allowMultiple={false}
                            maxFiles={1}
                            maxFileSize='50MB'
                            name="video"
                            labelIdle='Drag & Drop your video here or <span class="filepond--label-action">Browse</span>'
                            credits={{}}
                        />
                   </Box>
                </Flex>
            </MotionBox>
            <MotionButton isDisabled={!detailsConfirmed} icon={<MdNavigateNext />} colorScheme={"purple"}
                onClick={() => {
                    changeFormState(1);
                }} >
                {formState < 2 ? "Next":"Create"}
            </MotionButton>
        </Stack>
        </motion.div>
    )
}
/*    
import Image from 'next/image';

<Image
    layout='responsive'
    src="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
    alt="Random picture"
    width={500}
    height={500}
/>
*/