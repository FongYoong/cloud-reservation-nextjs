import Head from 'next/head';
import Image from 'next/image';
import { Zoom } from "react-awesome-reveal";
import { useBreakpointValue, Box, Flex, VStack, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';

export default function NotFound() {
    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });
    return (
        <div>
            <Head>
                <title>Help</title>
            </Head>
            <main>
                <Navbar />
                <NavbarSpace />
                <Zoom>
                  <Flex justify='center' >
                    <VStack m={breakpoint==='base'?2:8} p={breakpoint==='base'?2:8} spacing={4} w="100%" h='100%' align="center" justify="center" borderWidth={2} borderRadius="lg" boxShadow="lg" >
                        <Box borderRadius="full" overflow="hidden" bg="white" lineHeight="0" >
                          <Image
                            width={200}
                            height={200}
                            src='/images/help.gif'
                            alt="help"
                          />
                        </Box>
                        <Heading m={4} lineHeight='normal' bgGradient="linear(to-l, #7928CA,#FF0080)" bgClip="text" fontSize="4xl" fontWeight="extrabold" >
                            Help
                        </Heading>
                        <Accordion w='80%' allowMultiple allowToggle>
                          <AccordionItem>
                            <h2>
                              <AccordionButton>
                                <Text flex="1" textAlign="left" fontSize='xl'>
                                  Why choose Cloud Reservation over established competitors like Amazon or UpWork?
                                </Text>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <Text textAlign="left" fontSize='lg'>
                                Curiousity killed the cat.
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>

                          <AccordionItem>
                            <h2>
                              <AccordionButton>
                                <Text flex="1" textAlign="left" fontSize='xl' >
                                  Why is this help section so useless?
                                </Text>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <Text textAlign="left" fontSize='lg'>
                                Ever heard of the word &apos;laziness&apos;?
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                    </VStack>
                  </Flex>
                </Zoom>
            </main>
            <footer>

            </footer>
        </div>
  )
}