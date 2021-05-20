import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ScaleFade, Heading, Link, Stack, Box, Button, Container, Center, VStack } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../lib/auth';

export default function Purchases() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !auth) {
        router.replace('/marketplace');
    }
  }, [auth, loading, router]);

  return (
    <div>
      <Head>
        <title>Purchases</title>
        <link rel="icon" href="../public/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <NavbarSpace />
        <ScaleFade initialScale={0.9} in={true}>
        <Container>
          <Center mt={10}>
            <VStack spacing="4">
              <Heading fontSize="3xl" mb={2}>
                Purchases
              </Heading>
            </VStack>
          </Center>
        </Container>
        </ScaleFade>
      </main>
      <footer>

      </footer>
    </div>
  )
}
