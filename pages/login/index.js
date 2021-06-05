import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import {EmailLogin, EmailRegister} from '../../components/Email';
import { ScaleFade, Text, Heading, Flex, Spacer, Link, Input, Spinner, Stack, Box, Button, IconButton, Container, Center, HStack, VStack, Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import TextTransition, { presets } from "react-text-transition";
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { FcGoogle } from 'react-icons/fc';
import { RiFacebookCircleFill } from 'react-icons/ri';
import { HiOutlineMail } from 'react-icons/hi';
import { useAuth } from '../../lib/auth';

export default function Login() {
  const { auth, loading, signInWithAuthProvider, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && auth) {
        router.replace('/marketplace');
    }
  }, [auth, loading, router]);

  const emailFlipRef = useRef();
  const [mode, setMode] = useState("Login");

  // Link dialog
  const linkDialogState = useDisclosure(); // For link dialog
  const [chosenProvider, setChosenProvider] = useState("");
  const [linkingState, setLinkingState] = useState(false);
  const [linkAccount, setLinkAccount] = useState(() => {});
  const [linkProviderDomain, setLinkProviderDomain] = useState("");
  const handleLinkAccount = ({linkAccountMethod, providerDomain}) => {
    linkDialogState.onOpen();
    setLinkAccount(() => linkAccountMethod);
    setLinkProviderDomain(providerDomain);
  }
  const resetLinkDialog = () => {
    setLinkingState(null);
  }

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <main>
        <Navbar />
        <NavbarSpace />
        <ScaleFade initialScale={0.9} in={true}>
        <Container>
          <Flippy
            flipOnHover={false}
            flipOnClick={false}
            flipDirection="horizontal"
            ref={emailFlipRef}
          >
            <FrontSide style={{height:0, padding:0}}>
              <VStack p={4} spacing={4} borderWidth={2} borderRadius="lg" boxShadow="lg">
                <HStack spacing={2} align="center" justify="center">
                  <Button variant={mode==="Login"?"solid":"outline"} colorScheme="teal" onClick={() => setMode("Login")}>
                      Login
                  </Button>
                    <Button variant={mode!=="Login"?"solid":"outline"} colorScheme="teal" onClick={() => setMode("Register")}>
                      Register
                  </Button>
                </HStack>
                <VStack spacing={4} >
                  <Button leftIcon={<FcGoogle />} onClick={() => {
                    setChosenProvider("Google");
                    signInWithAuthProvider("google.com", handleLinkAccount)}}>
                    <TextTransition text={mode} springConfig={ presets.gentle } /> &nbsp;with Google
                  </Button>
                  <Button leftIcon={<RiFacebookCircleFill />} onClick={() => {
                    setChosenProvider("Facebook");
                    signInWithAuthProvider("facebook.com", handleLinkAccount)}}>
                    <TextTransition text={mode} springConfig={ presets.gentle } /> &nbsp;with Facebook
                  </Button>
                  <Button leftIcon={<HiOutlineMail />} onClick={() => emailFlipRef.current.toggle()}>
                    <TextTransition text={mode} springConfig={ presets.gentle } /> &nbsp;with Email
                  </Button>
                </VStack>
              </VStack>
            </FrontSide>
            <BackSide style={{padding:0}}>
              {mode === "Login" && /* Email login */
                  <EmailLogin submitHandler={signInWithEmail} backHandler={() => {emailFlipRef.current.toggle()}} loadingState={loading} />
              }
              {mode !== "Login" && /* Email sign up */
                  <EmailRegister submitHandler={signUpWithEmail} backHandler={() => {emailFlipRef.current.toggle()}} loadingState={loading} />
              }
            </BackSide>
          </Flippy>
        </Container>
        </ScaleFade>

        {/* Auth Link account dialog */}
        <Modal size="lg" motionPreset="scale" closeOnOverlayClick={false} closeOnEsc={false} isCentered={true} isOpen={linkDialogState.isOpen} onClose={linkDialogState.onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {linkingState ? "Linking..." : `Account already registered using ${linkProviderDomain} !` }
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Center>
              {linkingState ? <Spinner color="green.500" />
                :
                <Text fontSize="xl">
                  Do you want to link it with your {chosenProvider} account?
                </Text>
              }
              </Center>
            </ModalBody>
            <ModalFooter>
              {!linkingState &&
                <Button colorScheme="blue" mr={3} onClick={() => {
                    setLinkingState("linking");
                    linkAccount(() => {}, resetLinkDialog);
                  }}>
                  Yes!
                </Button>
              }
            </ModalFooter>
          </ModalContent>
        </Modal>
      </main>
      <footer>

      </footer>
    </div>
  )
}