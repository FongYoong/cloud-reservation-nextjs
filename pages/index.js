import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Zoom, JackInTheBox, Slide } from "react-awesome-reveal";
import { motion } from "framer-motion";
import { MotionGetAttention, MotionButton } from '../components/MotionElements';
import { useBreakpointValue, Divider, Flex, Heading, Text, HStack, VStack, Box, Button, Icon } from "@chakra-ui/react";
import Navbar from '../components/Navbar';
import NavbarSpace from '../components/NavbarSpace';
import { MdNavigateNext, MdWork, MdPeople, MdLocalGroceryStore } from 'react-icons/md';
import { RiChatSmile3Line } from 'react-icons/ri';
import { FaDotCircle } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
import Typewriter from 'typewriter-effect';
import TextTransition, { presets } from "react-text-transition";

const clientSellerVariants = {
    unselected: { scale: 1 },
    selected: { scale: 1.2 },
};

export default function NotFound() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(true);
    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });
    return (
        <div>
            <Head>
                <title>Cloud Reservation - Home</title>
            </Head>
            <main>
                <Navbar />
                <NavbarSpace />
                <VStack mb={24} spacing={4} w="100%" h='100%' align="center" justify="center">
                  <Zoom style={{width:'100%'}} triggerOnce >
                  <VStack p={4} w='100%' bgGradient="linear(to-r, #7F00FF, #E100FF)" >
                    <Flex p={2} w='100%' >
                      <Flex flex={2} align='start' justify='space-between' >
                        <Box />
                        <Box overflow="hidden" lineHeight="0" >
                          <Image
                            width='150'
                            height='150'
                            src='/images/cloud.gif'
                            alt="Cloud"
                          />
                        </Box>
                      </Flex>
                      <Flex flex={5} align='center' justify='space-between' >
                        <VStack ml={breakpoint==='base'?0:8} >
                          <Heading textAlign='center' px={8} m={4} color='white' fontSize={breakpoint==='base'?'2xl':'6xl'} fontWeight="extrabold" >
                            Cloud Reservation
                          </Heading>
                          <Divider borderWidth={1} borderColor='gray.50' />
                          <Text textAlign='center' color='white' fontSize={breakpoint==='base'?'xl':'4xl'} fontWeight="extrabold" >
                            Moving Towards
                            <u>
                            <Typewriter
                              onInit={(typewriter) => {
                                typewriter
                                  .typeString('a Reliable')
                                  .pauseFor(1500)
                                  .deleteChars(10)
                                  .typeString('an Efficient')
                                  .pauseFor(1500)
                                  .deleteChars(12)
                                  .typeString('a Robust')
                                  .pauseFor(1500)
                                  .deleteChars(8)
                                  .typeString('a Brighter')
                                  .pauseFor(1500)
                                  .deleteChars(8)
                                  .start();
                              }}
                              options={{
                                autoStart: true,
                                loop: true,
                              }}
                            />
                            </u>
                            Future
                          </Text>
                          <MotionGetAttention attentionType='expand' >
                            <Button mt={4} rightIcon={<MdNavigateNext />} colorScheme={"twitter"} onClick={() => { router.push('/login'); }} >
                              Get Started
                            </Button>
                          </MotionGetAttention>
                        </VStack>
                        <Box />
                      </Flex>
                    </Flex>
                  </VStack>
                  </Zoom>
                  <VStack p={4} w='100%' spacing={4} >
                    <Slide direction='left' triggerOnce >
                      <Heading textAlign='center' fontSize={breakpoint==='base'?'xl':'3xl'} lineHeight='normal' bgGradient="linear(to-r, #5433FF,#20BDFF)" bgClip="text" fontWeight="extrabold" >
                        What?
                      </Heading>
                      <Text textAlign='center' fontSize={breakpoint==='base'?'lg':'xl'} >
                        Cloud Reservation is a platform which strives to connect sellers and clients in this vastly interconnected world. <br/>
                        It bridges the cultural and communicative gaps often faced by small and large businesses alike.
                      </Text>
                    </Slide>
                    <Slide direction='right' triggerOnce >
                      <Box pt={12} pb={4} >
                        <Heading textAlign='center' fontSize={breakpoint==='base'?'xl':'3xl'} lineHeight='normal' bgGradient="linear(to-r, #5433FF,#20BDFF)" bgClip="text" fontWeight="extrabold" >
                          Why?
                        </Heading>
                      </Box>
                      <HStack spacing="8">
                        <motion.div variants={clientSellerVariants} animate={isClient?'selected':'unselected'}>
                            <MotionButton icon={isClient ? <FaDotCircle /> : <GoPrimitiveDot />} variant={isClient ? "solid":"outline"} colorScheme={"blue"}
                            onClick={() => {
                                setIsClient(true);
                            }} >
                                Client
                            </MotionButton>
                        </motion.div>
                        <motion.div variants={clientSellerVariants} animate={!isClient?'selected':'unselected'}>
                            <MotionButton icon={!isClient ? <FaDotCircle /> : <GoPrimitiveDot />} variant={!isClient ? "solid":"outline"} colorScheme={"blue"}
                            onClick={() => {
                                setIsClient(false);
                            }} >
                                Seller
                            </MotionButton>
                        </motion.div>
                      </HStack>
                    </Slide>
                    <Flex flexWrap='wrap'>
                      <VStack flex={1} p={4} spacing={4} justify='start' >
                        <JackInTheBox triggerOnce >
                          <Icon boxSize='3em' as={MdWork} />
                          <Heading fontSize={breakpoint==='base'?'lg':'xl'} lineHeight='normal' bgGradient="linear(to-r, #FF512F,#DD2476)" bgClip="text" fontWeight="bold" >
                            Services
                          </Heading>
                          <Text fontSize={breakpoint==='base'?'md':'lg'} >
                            <TextTransition
                            text={isClient ?
                            'Looking for a service? Book various services with reasonable hourly rates and flexible dates.'
                            :
                            'Are you skilled in something? Be the product of envy by creating your services with timeslots at your choosing.'
                            }
                            springConfig={ presets.gentle } />
                          </Text>
                        </JackInTheBox>
                      </VStack>
                      <VStack flex={1} p={4} spacing={4} justify='start' >
                        <JackInTheBox triggerOnce >
                        <Icon boxSize='3em' as={MdLocalGroceryStore} />
                        <Heading fontSize={breakpoint==='base'?'lg':'xl'} lineHeight='normal' bgGradient="linear(to-r, #FF512F,#DD2476)" bgClip="text" fontWeight="bold" >
                          Products
                        </Heading>
                        <Text fontSize={breakpoint==='base'?'md':'lg'} >
                          <TextTransition
                          text={isClient ?
                          'Looking for an item? Order products at any quantities. Shipping should be as quick as possible.'
                          :
                          "Have something to sell? Whether it's new or secondhand, there'll always be potential buyers for your product."
                          }
                          springConfig={ presets.gentle } />
                        </Text>
                        </JackInTheBox>
                      </VStack>
                      <VStack flex={1} p={4} spacing={4} justify='start' >
                        <JackInTheBox triggerOnce >
                          <Icon boxSize='3em' as={MdPeople} />
                          <Heading fontSize={breakpoint==='base'?'lg':'xl'} lineHeight='normal' bgGradient="linear(to-r, #FF512F,#DD2476)" bgClip="text" fontWeight="bold" >
                            Democratic
                          </Heading>
                          <Text fontSize={breakpoint==='base'?'md':'lg'} >
                            <TextTransition
                            text={isClient ?
                            "Worried about disagreements? Orders cannot proceed without the seller's approval and your payment."
                            :
                            "Worried about disagreements? Orders cannot proceed without your approval and the client's payment."
                            }
                            springConfig={ presets.gentle } />
                          </Text>
                        </JackInTheBox>
                      </VStack>
                      <VStack flex={1} p={4} spacing={4} justify='start' >
                        <JackInTheBox triggerOnce >
                          <Icon boxSize='3em' as={RiChatSmile3Line} />
                          <Heading fontSize={breakpoint==='base'?'lg':'xl'} lineHeight='normal' bgGradient="linear(to-r, #FF512F,#DD2476)" bgClip="text" fontWeight="bold" >
                            Chats
                          </Heading>
                          <Text fontSize={breakpoint==='base'?'md':'lg'} >
                            <TextTransition
                            text={isClient ?
                            "Chat with sellers anytime at your discretion to clarify anything."
                            :
                            "Chat with clients anytime at your discretion to clarify anything."
                            }
                            springConfig={ presets.gentle } />
                          </Text>
                        </JackInTheBox>
                      </VStack>
                    </Flex>
                  </VStack>
                  <Zoom>
                    <MotionGetAttention attentionType='expand' >
                      <Button mt={4} rightIcon={<MdNavigateNext />} size='lg' colorScheme={"purple"} onClick={() => { router.push('/login'); }} >
                        Give it a try?
                      </Button>
                    </MotionGetAttention>
                  </Zoom>
                </VStack>
            </main>
            <footer>

            </footer>
        </div>
  )
}