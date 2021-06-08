import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Zoom } from "react-awesome-reveal";
import { MotionButton } from '../components/MotionElements';
import { Flex, Heading, Text, Box } from "@chakra-ui/react";
import Navbar from '../components/Navbar';
import NavbarSpace from '../components/NavbarSpace';
import StringSimilarity from "string-similarity";
import { FaQuestionCircle } from 'react-icons/fa';

const pages = ['account', 'chats', 'help', 'login', 'marketplace', 'orders', 'services', 'payments'];

export default function NotFound() {
    const router = useRouter();
    const [bestMatch, setBestMatch] = useState('');
    useEffect(() => {
        const matches = StringSimilarity.findBestMatch(window.location.href.split('/').slice(3).join('/'), pages);
        setBestMatch(matches.bestMatch.target);
    }, []);
    //const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });
    return (
        <div>
            <Head>
                <title>404 - Page Not Found</title>
            </Head>
            <main>
                <Navbar />
                <NavbarSpace />
                <Zoom>
                    <Flex p={2} w="100%" direction="column" align="center" justify="center">
                        <Box boxShadow="base" borderRadius="lg" overflow="hidden" bg="white" lineHeight="0" >
                            <Image
                                priority={true}
                                width='533'
                                height='300'
                                src='/images/404.gif'
                                alt="404 - Page Not Found"
                            />
                        </Box>
                        <Heading m={4} textAlign='center' lineHeight='normal' bgGradient="linear(to-l, #7928CA,#FF0080)" bgClip="text" fontSize="4xl" fontWeight="extrabold" >
                            Page Not Found!
                        </Heading>
                        <Text m={4} textAlign='center' lineHeight='normal' bgGradient="linear(to-l, #7928CA,#FF0080)" bgClip="text" fontSize="2xl" align="center" >
                            Are you looking for:
                        </Text>
                        <MotionButton m={4} getAttention icon={<FaQuestionCircle />} colorScheme={"green"} onClick={() => {
                            router.push(bestMatch);
                        }} >
                            {bestMatch}
                        </MotionButton>
                    </Flex>
                </Zoom>
            </main>
            <footer>

            </footer>
        </div>
  )
}