import { Box, Button, Input, Heading, VStack, Text, useToast, Spinner } from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { signInWithEmail, signInWithGoogle, registerUser } from '../firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTE_LOGIN, ROUTE_SIGNUP } from '../common/consts';
import { useState } from 'react';

interface FormValues {
  email: string;
  password: string;
  name: string;
}

const AuthForm = () => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const isSignUp = location.pathname === ROUTE_SIGNUP;

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    ...(isSignUp && { name: Yup.string().required('Name is required') }),
  });

  const handleGoogleSignin = async () => {
    setLoadingGoogle(true);
    await signInWithGoogle();
    setLoadingGoogle(false);
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      if (isSignUp) {
        await registerUser(values.email, values.password, values.name);
      } else {
        await signInWithEmail(values.email, values.password);
      }
    } catch (err) {
      let text = 'Authentication failed. Please try again later.';
      if (err instanceof Error) text = err.message;
      toast({
        title: 'Error',
        description: text,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
    }
    setSubmitting(false);
  };

  return (
    <Box maxW="400px" mx="auto" p={4} textAlign="center">
      <Heading size="lg" mb={4}>
        {isSignUp ? 'Sign Up' : 'Login'}
      </Heading>
      <Formik initialValues={{ email: '', password: '', name: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <VStack spacing={3}>
              <Field as={Input} name="email" placeholder="Email" />
              <Box className="error-placeholder">
                <ErrorMessage name="email">{(msg) => <Text color="red.500">{msg}</Text>}</ErrorMessage>
              </Box>
              {isSignUp && (
                <>
                  <Field as={Input} name="name" placeholder="Name" />
                  <Box className="error-placeholder">
                    <ErrorMessage name="name">{(msg) => <Text color="red.500">{msg}</Text>}</ErrorMessage>
                  </Box>
                </>
              )}
              <Field as={Input} type="password" name="password" placeholder="Password" />
              <Box className="error-placeholder">
                <ErrorMessage name="password">{(msg) => <Text color="red.500">{msg}</Text>}</ErrorMessage>
              </Box>
              <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
              {!isSignUp && (
                <>
                  <Text>or</Text>
                  <Button colorScheme="red" onClick={handleGoogleSignin} isLoading={loadingGoogle}>
                    Sign in with Google
                  </Button>
                </>
              )}
              <Button variant="link" colorScheme="blue" onClick={() => navigate(isSignUp ? ROUTE_LOGIN : ROUTE_SIGNUP)}>
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AuthForm;
