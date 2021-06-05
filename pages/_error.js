import Head from 'next/head';
import { useRouter } from 'next/router';
import { MotionButton } from '../components/MotionElements';
import { ScaleFade, Flex, Heading, Text } from "@chakra-ui/react";
import Navbar from '../components/Navbar';
import NavbarSpace from '../components/NavbarSpace';
import { IoArrowBackCircle } from 'react-icons/io5';

function Error({ statusCode }) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Error!</title>
      </Head>
      <main>
        <Navbar />
        <NavbarSpace />
        <ScaleFade initialScale={0.9} in={true}>
          <Flex p={2} w="100%" direction="column" align="center" justify="center" >
            <Heading mb={4} >
              Alamak!
            </Heading>
            <Text fontSize='lg' >
                {statusCode
                    ? `An error ${statusCode} occurred on the server.`
                    : 'An error occurred on the client.'
                }
            </Text>
                <MotionButton mt={4} icon={<IoArrowBackCircle />} colorScheme={"pink"} onClick={() => router.back()} >
                    Go Back
                </MotionButton>
          </Flex>
        </ScaleFade>

      </main>
      <footer>

      </footer>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error