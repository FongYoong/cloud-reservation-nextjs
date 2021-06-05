import { memo, useState } from 'react';
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

import { motion } from "framer-motion";
import { MotionButton } from '../MotionElements';
import { Divider, Box, Flex, VStack, Heading, UnorderedList, ListItem,
    Input,
    Textarea,
    FormControl,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/react';
import { MdNavigateNext } from 'react-icons/md';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ProfileSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
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

export default memo(function ProfileForm({ completeFormHandler, initialUsername='', initialDescription='', initialImageFile=[] }) {

    const [imageFile, setImageFile] = useState(initialImageFile);

    return (
        <motion.div
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack w='100%' m={2} p={4} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                <Formik
                    initialValues={{
                        username: initialUsername ? initialUsername : '',
                        description: initialDescription ? initialDescription : '',
                    }}
                    validationSchema={ProfileSchema}
                    onSubmit={(values) => {
                        completeFormHandler({username: values.username, description: values.description, imageFile});
                    }}
                    >
                    {({errors, touched, handleChange}) => (
                    <Form
                        style={{width:'100%'}}
                        onChange={e => {
                            handleChange(e);
                        }}
                    >
                        <VStack w='100%' p={4} spacing={3} align="center" justify="center" borderWidth={2} borderRadius="lg" boxShadow="lg">
                            <Flex align="center" justify="center" direction="column">
                                <Heading fontSize='lg' >
                                    Profile Picture
                                </Heading>
                                <UnorderedList my={4}>
                                    <ListItem>File size: <b>10 MB</b> maximum</ListItem>
                                </UnorderedList>
                                <Box width="100%">
                                <FilePond
                                    server={filepondServerConfig}
                                    allowProcess={false}
                                    files={imageFile}
                                    onupdatefiles={setImageFile}
                                    instantUpload={false}
                                    acceptedFileTypes={['image/*']}
                                    labelFileTypeNotAllowed='Only images are allowed'
                                    fileValidateTypeLabelExpectedTypes=""
                                    allowMultiple={true}
                                    allowReorder={true}
                                    maxFiles={1}
                                    maxFileSize='10MB'
                                    name="image"
                                    labelIdle='Drag & Drop your image here or <span class="filepond--label-action">Browse</span>'
                                    credits={{}}
                                />
                                </Box>
                            </Flex>
                            <Field name="username" >
                                {({ field }) => (
                                <FormControl isInvalid={errors.username && touched.username} isRequired>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Input {...field} id="username" placeholder="" />
                                <FormErrorMessage>{errors.username}</FormErrorMessage>
                                </FormControl>
                                )}
                            </Field>
                            <Field name="description" >
                                {({ field }) => (
                                <FormControl isInvalid={errors.description && touched.description} isRequired>
                                <FormLabel htmlFor="description">Description</FormLabel>
                                <Textarea size="sm" id="description" placeholder="Once upon a time..."  {...field} />
                                <FormErrorMessage>{errors.description}</FormErrorMessage>
                                </FormControl>
                                )}
                            </Field>
                            <MotionButton
                                type='submit'
                                getAttention={false} icon={<MdNavigateNext />} colorScheme={"teal"} >
                                Update
                            </MotionButton>
                        </VStack>
                    </Form>
                    )}
                </Formik>
            </VStack>
        </motion.div>
    )
});