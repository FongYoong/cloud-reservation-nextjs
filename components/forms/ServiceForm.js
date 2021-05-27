import { useState } from 'react';
import { Fade } from "react-awesome-reveal";

// File Pond
import { FilePond, registerPlugin } from 'react-filepond'; // Import React FilePond
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
//import FilePondPluginMediaPreview from 'filepond-plugin-media-preview';
//import 'filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

// Vime
import { Player, Video, DefaultUi } from '@vime/react';
import '@vime/core/themes/default.css';

import { motion } from "framer-motion";
import { MotionButton, MotionBox, formVariants, initialFormVariants } from '../MotionElements';
import { ScaleFade, Box, Flex, Text, Stack, HStack, VStack, Button, Heading, UnorderedList, ListItem, CheckboxGroup, Checkbox,
    Input,
    Textarea,
    FormControl,
    FormLabel,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react';

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

const filepondServerConfig = {
    load: (source, load, error, progress, abort, headers) => {
        let myRequest = new Request(source);
        fetch(myRequest).then(function(response) {
            response.blob().then(function(myBlob) {
            load(myBlob)
            });
        });         
    },
}

const processPriceValue = (price) => {
    return parseFloat(parseFloat(price).toFixed(2));
}

const serviceTypeVariants = {
    unselected: { scale: 1 },
    selected: { scale: 1.2 },
};

export default function ServiceForm({ update, completeFormHandler, initialServiceType='service', initialDetails={}, initialDays=[], initialImageFiles=[], initialVideoFile=[] }) {
    //formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //const serviceTypeFlipRef = useRef();
    const [isFlipped, setIsFlipped] = useState(initialServiceType !== 'service'); // service, product
    const [serviceType, setServiceType] = useState(initialServiceType); // service, product
    const [formState, setFormState] = useState(0);

    const changeFormState = (change) => {
        if (formState < 3 || change === -1) {
            setFormState(formState + change);
        }
        else {
            completeFormHandler({serviceType, details, availableDays, imageFiles, videoFile})
        }
    }

    let detailsTrans, availableDaysTrans, imagesTrans, videoTrans;
    if (formState === 0) {
        detailsTrans = 'in';
        availableDaysTrans = 'right';
        imagesTrans = 'right';
        videoTrans = 'right';
    }
    if (formState === 1) {
        detailsTrans = 'left';
        availableDaysTrans = 'in';
        imagesTrans = 'right';
        videoTrans = 'right';
    }
    if (formState === 2) {
        detailsTrans = 'left';
        availableDaysTrans = 'left';
        imagesTrans ='in';
        videoTrans = 'right';
    }
    if (formState === 3) {
        detailsTrans = 'left';
        availableDaysTrans = 'left';
        imagesTrans = 'left';
        videoTrans = 'in';
    }
    const [detailsConfirmed, setDetailsConfirmed] = useState(initialDetails.name ? true : false);
    const [details, setDetails] = useState(initialDetails);
    const [availableDays, setAvailableDays] = useState(initialDays);
    const [imageFiles, setImageFiles] = useState(initialImageFiles);
    const [videoFile, setVideoFile] = useState(initialVideoFile);
    return (
        <motion.div
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
        <Stack align={["center", "start"]} justify={["center", "space-between"]} direction={["column", "row"]} spacing="4"  m={2} p={4} borderWidth={2} borderRadius="lg" boxShadow="lg" >
            <MotionButton disabled={formState === 0} icon={<MdNavigateBefore />} variant="outline" colorScheme={"purple"}
                onClick={() => {
                    if (serviceType === 'product' && formState === 2) {
                        changeFormState(-2);
                    }
                    else {
                        changeFormState(-1);
                    }
                }} >
                Previous
            </MotionButton>
            <motion.div initial={false} variants={formVariants} animate={detailsTrans}>
                <VStack spacing="4" >
                    <HStack spacing="8">
                        <motion.div variants={serviceTypeVariants} animate={serviceType==='service'?'selected':'unselected'}>
                            <MotionButton icon={serviceType==='service' ? <FaDotCircle /> : <GoPrimitiveDot />} variant={serviceType==='service' ? "solid":"outline"} colorScheme={"blue"} onClick={() => {
                                if (serviceType==='product') setIsFlipped(false);
                                setServiceType('service');
                                setDetailsConfirmed(false);
                            }} >
                                Service
                            </MotionButton>
                        </motion.div>
                        <motion.div variants={serviceTypeVariants} animate={serviceType==='product'?'selected':'unselected'}>
                            <MotionButton icon={serviceType==='product' ? <FaDotCircle /> : <GoPrimitiveDot />} variant={serviceType==='product' ? "solid":"outline"} colorScheme={"blue"} onClick={() => {
                                if (serviceType==='service') setIsFlipped(true);
                                setServiceType('product');
                                setDetailsConfirmed(false);
                            }} >
                                Product
                            </MotionButton>
                        </motion.div>
                    </HStack>
                    <Flippy
                        isFlipped={isFlipped}
                        flipOnHover={false}
                        flipOnClick={false}
                        flipDirection="horizontal"
                    >
                        <FrontSide style={{height:'100%', padding:0}}>
                            {/* Service details */}
                            <Formik
                                initialValues={{
                                    name: initialDetails.name ? initialDetails.name : '',
                                    description: initialDetails.description ? initialDetails.description : '',
                                    minPrice: initialDetails.minPrice ? initialDetails.minPrice : 1,
                                    maxPrice: initialDetails.maxPrice ? initialDetails.maxPrice : 2,
                                }}
                                validationSchema={ServiceSchema}
                                onSubmit={(values) => {
                                    setDetails({
                                        ...values,
                                        minPrice: processPriceValue(values.minPrice),
                                        maxPrice: processPriceValue(values.maxPrice),
                                    });
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
                                        <FormLabel htmlFor="nameService">Service Name</FormLabel>
                                        <Input {...field} id="nameService" placeholder="" />
                                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name="description" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.description && touched.description} isRequired>
                                        <FormLabel htmlFor="descriptionService">Description</FormLabel>
                                        <Textarea size="sm" id="descriptionService" placeholder="Once upon a time..."  {...field} />
                                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name="minPrice" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.minPrice && touched.minPrice} isRequired>
                                        <FormLabel htmlFor="minPrice">Minimum Price per Hour</FormLabel>
                                        <NumberInput id="minPrice" defaultValue={initialDetails.minPrice ? initialDetails.minPrice : 1} min={0.01} precision={2} >
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
                                        <NumberInput id="maxPrice" defaultValue={initialDetails.maxPrice ? initialDetails.maxPrice : 2} min={0.01} precision={2} >
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
                                    name: initialDetails.name ? initialDetails.name : '',
                                    description: initialDetails.description ? initialDetails.description : '',
                                    price: initialDetails.price ? initialDetails.price : 1,
                                }}
                                validationSchema={ProductSchema}
                                onSubmit={values => {
                                    setDetails({
                                        ...values,
                                        price: processPriceValue(values.price),
                                    });
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
                                            <FormLabel htmlFor="nameProduct">Product Name</FormLabel>
                                            <Input {...field} id="nameProduct" placeholder="" />
                                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                        <Field name="description" >
                                            {({ field }) => (
                                            <FormControl isInvalid={errors.description && touched.description} isRequired>
                                            <FormLabel htmlFor="descriptionProduct">Description</FormLabel>
                                            <Textarea size="sm" id="descriptionProduct" placeholder="Once upon a time..."  {...field} />
                                            <FormErrorMessage>{errors.description}</FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                        <Field name="price" >
                                            {({ field }) => (
                                            <FormControl isInvalid={errors.price && touched.price} isRequired>
                                            <FormLabel htmlFor="price">Price per Item</FormLabel>
                                            <NumberInput id="price" defaultValue={initialDetails.price ? initialDetails.price : 1} min={0.01} precision={2} >
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
            <motion.div initial={initialFormVariants} variants={formVariants} animate={availableDaysTrans}>
                <VStack align="center" justify="center" >
                    <Heading m="4" textAlign="center">
                        Available Days
                    </Heading>
                    <CheckboxGroup onChange={(values) => setAvailableDays(values.sort())} colorScheme="green" defaultValue={availableDays}>
                        <Checkbox value="0">Monday</Checkbox>
                        <Checkbox value="1">Tuesday</Checkbox>
                        <Checkbox value="2">Wednesday</Checkbox>
                        <Checkbox value="3">Thursday</Checkbox>
                        <Checkbox value="4">Friday</Checkbox>
                        <Checkbox value="5">Saturday</Checkbox>
                        <Checkbox value="6">Sunday</Checkbox>
                    </CheckboxGroup>
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
                        server={filepondServerConfig}
                        allowProcess={false}
                        files={imageFiles}
                        onupdatefiles={setImageFiles}
                        instantUpload={false}
                        acceptedFileTypes={['image/*']}
                        labelFileTypeNotAllowed='Only images are allowed'
                        fileValidateTypeLabelExpectedTypes=""
                        allowMultiple={true}
                        allowReorder={true}
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
                            server={filepondServerConfig}
                            allowProcess={false}
                            files={videoFile}
                            onupdatefiles={setVideoFile}
                            instantUpload={false}
                            acceptedFileTypes={['video/*']}
                            labelFileTypeNotAllowed='Only videos are allowed'
                            fileValidateTypeLabelExpectedTypes=""
                            allowMultiple={false}
                            allowReorder={true}
                            maxFiles={1}
                            maxFileSize='50MB'
                            name="video"
                            labelIdle='Drag & Drop your video here or <span class="filepond--label-action">Browse</span>'
                            credits={{}}
                        />
                   </Box>
                   <Box width="100%">
                    <ScaleFade initialScale={0.9} in={videoFile[0]}>
                        {videoFile[0] &&
                            <Player theme="dark" style={{ '--vm-player-theme': '#e86c8b' }} >
                                <Video crossOrigin>
                                    <source data-src={(typeof videoFile[0].source === 'string') ? videoFile[0].source : URL.createObjectURL(videoFile[0].file)} />
                                </Video>
                                <DefaultUi noCaptions={true} noPoster={true} />
                            </Player>
                        }
                    </ScaleFade>
                    </Box>
                </Flex>
            </MotionBox>
            <MotionButton
                getAttention={formState === 3}
                isDisabled={!detailsConfirmed || (formState === 1 && availableDays.length === 0)}
                icon={<MdNavigateNext />} colorScheme={"purple"}
                onClick={() => {
                    if (serviceType === 'product' && formState === 0) {
                        changeFormState(2);
                    }
                    else {
                        changeFormState(1);
                    }
                }} >
                {formState < 3 ? "Next":(update ? "Update" : "Create")}
            </MotionButton>
        </Stack>
        </motion.div>
    )
}