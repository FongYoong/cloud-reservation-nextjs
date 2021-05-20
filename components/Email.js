import { Text, Input, Button, IconButton, HStack, VStack, Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { IoReturnUpBack } from 'react-icons/io5';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email!').required('Required'),
  password: Yup.string().min(6, 'Password must have a minimum of 6 characters!').required('Required'),
});

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too short!').max(50, 'Too long!').required('Required'),
  email: Yup.string().email('Invalid email!').required('Required'),
  password: Yup.string().min(6, 'Password must have a minimum of 6 characters!').required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required')
});

export function EmailLogin({submitHandler, backHandler, loadingState}) {
    return (
        <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={values => {
                submitHandler(values.email, values.password);
            }}
        >
            {({errors, touched}) => (
            <Form>
                <VStack p={4} spacing={4} borderWidth={2} borderRadius="lg" boxShadow="lg">
                <HStack>
                    <IconButton icon={<IoReturnUpBack />} onClick={() => {backHandler()}} />
                    <Text as="b" fontSize="lg">Login</Text>
                </HStack>
                <Divider />
                <Field name="email" >
                    {({ field }) => (
                    <FormControl isInvalid={errors.email && touched.email} isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input {...field} id="email" placeholder="" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Field name="password" >
                    {({ field }) => (
                    <FormControl isInvalid={errors.password && touched.password} isRequired>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input {...field} type="password" id="password" placeholder="" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={loadingState}
                    type="submit"
                >
                Submit
                </Button>
                </VStack>
            </Form>
            )}
        </Formik>
    )
}

export function EmailRegister({submitHandler, backHandler, loadingState}) {
    return (
      <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={values => {
            submitHandler(values.name, values.email, values.password);
          }}
        >
          {({errors, touched}) => (
            <Form>
              <VStack p={4} spacing={4} borderWidth={2} borderRadius="lg" boxShadow="lg">
                <HStack>
                  <IconButton icon={<IoReturnUpBack />} onClick={() => {backHandler()}} />
                  <Text as="b" fontSize="lg">Register</Text>
                </HStack>
                <Divider />
                <Field name="name" >
                  {({ field }) => (
                  <FormControl isInvalid={errors.name && touched.name} isRequired>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input {...field} id="name" placeholder="" />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>
                  )}
                </Field>
                <Field name="email" >
                  {({ field }) => (
                  <FormControl isInvalid={errors.email && touched.email} isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input {...field} id="email" placeholder="" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  )}
                </Field>
                <Field name="password" >
                  {({ field }) => (
                  <FormControl isInvalid={errors.password && touched.password} isRequired>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input {...field} type="password" id="password" placeholder="" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  )}
                </Field>
                <Field name="confirmPassword" >
                  {({ field }) => (
                  <FormControl isInvalid={errors.confirmPassword && touched.confirmPassword} isRequired>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <Input {...field}  type="password" id="confirmPassword" placeholder="" />
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                  )}
                </Field>
                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={loadingState}
                  type="submit"
                >
                Submit
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
    )
}