import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { updateOrderStatus } from '../../lib/db';
import { motion } from "framer-motion";
import { MotionButton, MotionGetAttention } from '../MotionElements';
import UserAvatar from '../UserAvatar';
import { CanvasRain } from '../CanvasRain';
import { Calendar, formatEvents, calculateEventHours } from '../Calendar';
import { Views } from "react-big-calendar";
import { Img, Flex, Box, VStack, HStack, Button, Heading, Text, Textarea, Stat, StatLabel, StatNumber, StatHelpText, Divider, Spacer, Avatar, AvatarBadge,
useBreakpointValue,
useToast,
useColorModeValue,
useDisclosure,
Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalCloseButton,
ModalBody,
ModalFooter,
CircularProgress
} from '@chakra-ui/react';

import { FaRegSmile, FaRegSadCry } from 'react-icons/fa';
import { MdDelete, MdAttachMoney } from 'react-icons/md';

export default function OrderStatus({auth, isServiceOwner, serviceId, orderId, servicePublicData, orderData}) {
    const router = useRouter();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState(orderData.calendarEvents ? formatEvents(orderData.calendarEvents) : null);
    const [totalEventHours, setTotalEventHours] = useState(orderData.calendarEvents ? calculateEventHours(orderData.calendarEvents) : null);
    const totalPrice = servicePublicData.type === 'service' ? orderData.details.proposedPricePerHour * totalEventHours : servicePublicData.price * orderData.details.quantity;
    const [clickedEvent, setClickedEvent] = useState({title: '', start: new Date(), end: new Date() });
    const eventModalState = useDisclosure();
    const [showRain, setShowRain] = useState(false);
    const acceptRemarksRef = useRef(null);
    const rejectRemarksRef = useRef(null);
    const acceptModalState = useDisclosure();
    const acceptHandler = () => {
        setIsLoading(true);
        updateOrderStatus(auth, serviceId, orderId, {
            status: 'accepted',
            approvalRemarks: acceptRemarksRef.current.value,
        }, () => {
            toast({
                title: `Succesfully accepted order!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            acceptModalState.onClose();
        }, () => {
            alert("Firebase Error");
        });
    }
    const rejectModalState = useDisclosure();
    const rejectHandler = () => {
        setIsLoading(true);
        updateOrderStatus(auth, serviceId, orderId, {
            status: 'rejected',
            approvalRemarks: rejectRemarksRef.current.value,
        }, () => {
            toast({
                title: `Succesfully rejected order!`,
                description: "Cheers! 😃",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            rejectModalState.onClose();
        }, () => {
            alert("Firebase Error");
        });
    }
    const payModalState = useDisclosure();
    const payHandler = () => {
        setIsLoading(true);
        updateOrderStatus(auth, serviceId, orderId, {
            status: 'paidByUser',
        }, () => {
            toast({
                title: `Succesfully paid for order!`,
                description: "Cheers! 😃",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            payModalState.onClose();
        }, () => {
            alert("Firebase Error");
        });
    }
    const sellerRemarksBg = useColorModeValue("purple.100", "purple.500");
    const priceBg = useColorModeValue("green.100", "green.500");
    //const priceBg2 = useColorModeValue("pink.100", "pink.500");
    const remarksBg = useColorModeValue("orange.100", "orange.500");
    const addressBg = useColorModeValue("yellow.100", "yellow.500");
    const calendarBg = useColorModeValue("cyan.50", "cyan.600");
    const calendarBg2 = useColorModeValue("cyan.100", "cyan.800");

    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

    return (
        <motion.div
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={2} p={4} spacing={4} borderWidth={2} borderRadius="lg" boxShadow="lg">
{/* Seller view */}
                {isServiceOwner && orderData.status === 'initial' && <>
                    <Text mb={1} fontSize="xl" align="center" >
                        <b> The client is awaiting your approval. </b>
                    </Text>
                    <MotionGetAttention>
                        <HStack spacing={4} align="center" justify="center">
                            <MotionButton icon={<FaRegSmile />} colorScheme={"green"} onClick={acceptModalState.onOpen} >
                                Accept
                            </MotionButton>
                            <MotionButton icon={<MdDelete />} colorScheme={"red"} onClick={rejectModalState.onOpen} >
                                Reject
                            </MotionButton>
                        </HStack>
                    </MotionGetAttention> </>
                }
                {isServiceOwner && orderData.status === 'accepted' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> You have <Text as='span' color='green.500'> accepted </Text> the client&apos;s order. <br />
                            Please wait for the client to make a payment. </b>
                        </Text>
                    </MotionGetAttention>
                    <Img
                        borderRadius="full"
                        boxSize="20vh"
                        src="/images/waiting.gif"
                        alt="Waiting"
                    /> </>
                }
                {isServiceOwner && orderData.status === 'rejected' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> You have <Text as='span' color='red.500'> rejected </Text> the client&apos;s order. </b>
                        </Text>
                    </MotionGetAttention>
                    <Img
                        borderRadius="full"
                        boxSize="20vh"
                        src="/images/sleeping.gif"
                        alt="Waiting"
                    /> </>
                }
                {isServiceOwner && orderData.status === 'paidByUser' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> The user has <Text as='span' color='green.500'> paid </Text> for the order! <span role='img' aria-label="happy">😃</span> </b>
                        </Text>
                    </MotionGetAttention> </>
                }

{/* Client view */}
                {!isServiceOwner && orderData.status === 'initial' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> Your order is waiting for approval by the seller. </b>
                        </Text>
                    </MotionGetAttention>
                    <Img
                        borderRadius="full"
                        boxSize="20vh"
                        src="/images/waiting.gif"
                        alt="Waiting"
                    /> </>
                }
                {!isServiceOwner && orderData.status === 'accepted' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> The seller has <Text as='span' color='green.500'> approved </Text> your order! <span role='img' aria-label="happy">😃</span> </b>
                        </Text>
                    </MotionGetAttention>
                    <motion.div whileHover={{ scale: 1.1 }} >
                        <VStack p={2} bg={sellerRemarksBg} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                            <Text fontSize="md" > Seller remarks: </Text>
                            <Divider borderColor='black.300' />
                            <Text whiteSpace="pre-wrap" fontSize={["md", "lg"]} > <b> {orderData.approvalRemarks} </b> </Text>
                        </VStack>
                    </motion.div>
                    <MotionGetAttention>
                        <MotionButton icon={<MdAttachMoney />} colorScheme={"green"} onClick={payModalState.onOpen} >
                            Pay
                        </MotionButton>
                    </MotionGetAttention> </>
                }
                {!isServiceOwner && orderData.status === 'rejected' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> The seller has <Text as='span' color='red.500'> rejected </Text> your order! <span role='img' aria-label="sad">😢</span> </b>
                        </Text>
                    </MotionGetAttention>
                    <motion.div whileHover={{ scale: 1.1 }} >
                        <VStack p={2} bg={sellerRemarksBg} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                            <Text fontSize="md" > Seller remarks: </Text>
                            <Divider borderColor='black.300' />
                            <Text whiteSpace="pre-wrap" fontSize={["md", "lg"]} > <b> {orderData.approvalRemarks} </b> </Text>
                        </VStack>
                    </motion.div>
                   <Img
                        boxSize="20vh"
                        src="/images/angry.gif"
                        alt="Waiting"
                    />
                    <MotionButton icon={<FaRegSadCry />} colorScheme={"red"} onClick={() => {setShowRain(!showRain)}} >
                        Make it rain!
                    </MotionButton>
                    {showRain &&
                        <CanvasRain fullScreen={true} style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            zIndex: -1000,
                        }} />
                    }
                    </>
                }
                {!isServiceOwner && orderData.status === 'paidByUser' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> Payment successful! <span role='img' aria-label="happy">😃</span> <br/>
                            The seller is <Text as='span' color='green.500'> now working </Text> on your order! </b>
                        </Text>
                    </MotionGetAttention> </>
                }
                
                <Divider borderColor='black.500' />
{/* Order details */}
                <VStack width={breakpoint==='base'?'100%':'50%'} p={2} bg={useColorModeValue('white', 'gray.700')} rounded={{ md: 'lg' }} borderWidth={2} boxShadow="lg" >
                    <Flex p={2} width="100%" align="center" justify="start" borderBottomWidth={1}>
                        <Heading flex={3} as="h2" fontSize="lg">
                            Order Details
                        </Heading>
                        <Box flex={1} />
                    </Flex>
                    <OrderDetailsRow>
                        <Text flex={2}> Ordered by: </Text>
                        <Flex flex={5} p={2} justify={breakpoint==='base'?'center':'start'} >
                            <UserAvatar name='abc' src='abc' />
                        </Flex>
                    </OrderDetailsRow>
                    <OrderDetailsRow>
                        <Text flex={2}> Created on: </Text>
                        <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > {new Date(orderData.dateCreated).toDateString()} </Text>
                    </OrderDetailsRow>
                    {servicePublicData.type === 'service' && <>
                        <OrderDetailsRow>
                            <Text flex={2} > {isServiceOwner?'Your':'Seller'} price range:  </Text>
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {servicePublicData.minPrice} ~ {servicePublicData.maxPrice} </Text>
                        </OrderDetailsRow>
                        <OrderDetailsRow>
                            <Text flex={2} > {isServiceOwner?"Client's":'Your'} price/hour: </Text>
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {orderData.details.proposedPricePerHour} </Text>
                        </OrderDetailsRow>
                        <OrderDetailsRow>
                            <Text flex={2} > Total hours: </Text>
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > {totalEventHours} </Text>
                        </OrderDetailsRow>
                        <Divider borderColor='black.300' />
                    </> }
                    {servicePublicData.type === 'product' && <>
                        <OrderDetailsRow>
                            <Text flex={2} > {isServiceOwner?'Your':'Seller'} price per item:  </Text>
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {servicePublicData.price} </Text>
                        </OrderDetailsRow>
                        <OrderDetailsRow>
                            <Text flex={2} > Quantity: </Text>
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > {orderData.details.quantity} </Text>
                        </OrderDetailsRow>
                        <Divider borderColor='black.300' />
                    </> }
                    <OrderDetailsRow bg={priceBg}>
                        <Text fontSize="lg" flex={2} > Total price: </Text>
                        <Text fontSize="lg" flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {totalPrice}  </Text>
                    </OrderDetailsRow>
                </VStack>

                <Divider borderColor='black.500' />
                {servicePublicData.type === 'service' &&
                    <Box p={1} width="100%" _hover={{bg:calendarBg2}} bg={calendarBg} borderWidth={1} borderRadius="lg" >
                        <Calendar
                            resizable={false}
                            views={[Views.DAY, Views.WEEK, Views.AGENDA]}
                            defaultView={Views.AGENDA}
                            events={calendarEvents}
                            onSelectEvent={(event) => {
                                setClickedEvent(event);
                                eventModalState.onOpen();
                            }}
                        />
                    </Box>
                }
            </VStack>

{/* Modals */}
            <Modal motionPreset="scale" isCentered={true} isOpen={eventModalState.isOpen} onClose={eventModalState.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Event</ModalHeader>
                     <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center" justify="center">
                            <Stat p={2} mb={2} borderWidth={2} borderRadius="lg">
                                <StatLabel>{clickedEvent.start.toDateString()}</StatLabel>
                                <StatNumber>{clickedEvent.start.toLocaleTimeString()} to {clickedEvent.end.toLocaleTimeString()}</StatNumber>
                                <StatHelpText>Title:&nbsp;{clickedEvent.title}</StatHelpText>
                            </Stat>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal initialFocusRef={acceptRemarksRef} motionPreset="scale" closeOnOverlayClick={isLoading} closeOnEsc={isLoading} isCentered={true} isOpen={acceptModalState.isOpen} onClose={acceptModalState.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Accept Order?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center" justify="center">
                            <form onSubmit={(e) => {
                                    e.preventDefault();
                                    acceptHandler();
                                } }>
                                <Text as="b"> Note: This cannot be undone. </Text>
                                <Text mb={2}> Please state any further info for the client if there is any. </Text>
                                <Textarea size="sm" ref={acceptRemarksRef} defaultValue=''  placeholder="" />
                            </form>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        {isLoading ?
                            <Flex align="center" justify="center">
                                <CircularProgress isIndeterminate color="green.400" />
                            </Flex>
                            :
                            <Button colorScheme="green" mr={3} onClick={acceptHandler}>
                                Accept!
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal initialFocusRef={rejectRemarksRef} motionPreset="scale" closeOnOverlayClick={isLoading} closeOnEsc={isLoading} isCentered={true} isOpen={rejectModalState.isOpen} onClose={rejectModalState.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reject Order?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center" justify="center">
                            <form onSubmit={(e) => {
                                    e.preventDefault();
                                    rejectHandler();
                                } }>
                                <Text as="b"> Note: This cannot be undone. </Text>
                                <Text mb={2}> Please state your reasons for rejecting this order. </Text>
                                <Textarea size="sm" ref={rejectRemarksRef} defaultValue=''  placeholder="" />
                            </form>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        {isLoading ?
                            <Flex align="center" justify="center">
                                <CircularProgress isIndeterminate color="green.400" />
                            </Flex>
                            :
                            <Button colorScheme="red" mr={3} onClick={rejectHandler}>
                                Reject!
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal motionPreset="scale" closeOnOverlayClick={isLoading} closeOnEsc={isLoading} isCentered={true} isOpen={payModalState.isOpen} onClose={payModalState.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Pay for Order?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center" justify="center">
                            <Text as="b"> Note: This cannot be undone. </Text>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        {isLoading ?
                            <Flex align="center" justify="center">
                                <CircularProgress isIndeterminate color="green.400" />
                            </Flex>
                            :
                            <Button colorScheme="green" mr={3} onClick={payHandler}>
                                Pay!
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </motion.div>
    )
}

const OrderDetailsRow = ({children, ...props}) => {
    return (
        <Box {...props} width="100%" >
            <motion.div whileHover={{ scale: 1.05, backgroundColor: useColorModeValue('#d6ffd6', '#5db65d'), borderRadius: '0.5em' }} >
                <Flex px={4} py={2} align="center" justify="center" >
                    {children}
                </Flex>
            </motion.div>
        </Box>
    )
}

/*
                <Flex flexWrap='wrap' width='100%' align="center" justify="space-evenly" >
                    <VStack p={2} m={2} spacing={4} bg={orderBg} borderWidth={1} borderRadius="lg" >
                        <Heading as='u' fontSize="xl" textAlign="center" >
                            Order Status
                        </Heading>
                        <HStack w="100%" h="50px" spacing={4} align="center" justify="center" >
                            <Text fontSize="lg" >Ordered by</Text>
                            <UserAvatar name='abc' src='abc' />
                        </HStack>
                        <Text fontSize="lg" > Created on <b> {new Date(orderData.dateCreated).toDateString()} </b> </Text>
                    </VStack>
                    <motion.div whileHover={{ scale: 1.1 }} >
                        {servicePublicData.type === 'service' &&
                            <HStack p={2} spacing={2} bg={priceBg} borderWidth={1} borderRadius="lg" >
                                <VStack>
                                    <Text fontSize={["xs", "sm"]} > {isServiceOwner?'Your':'Seller'} price range:  </Text>
                                    <Text as='b' fontSize={["xs", "sm"]} > RM {servicePublicData.minPrice} ~ {servicePublicData.maxPrice} </Text>
                                    <Divider borderColor='black.300' />
                                    <VStack p={2} bg={priceBg2} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                                        <Text fontSize={["md", "lg"]} >
                                            {isServiceOwner?"Client's":'Your'} price/hour:
                                        </Text>
                                        <Text as='b' fontSize={["md", "lg"]} >
                                            RM {orderData.details.proposedPricePerHour}
                                        </Text>
                                    </VStack>
                                </VStack>
                                <Box height="7em">
                                    <Divider orientation='vertical' borderColor='black.300' />
                                </Box>
                                <VStack p={2} bg={priceBg2} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                                    <Text fontSize="lg" ><b>{totalEventHours} hours</b> </Text>
                                    <Divider borderColor='black.300' />
                                    <Text fontSize={["md", "lg"]} > Total price: <b>RM {totalPrice} </b> </Text>
                                </VStack>
                            </HStack>
                        }
                    </motion.div>
                    <VStack m={2} >
                        { servicePublicData.type === 'product' &&
                            <VStack p={2} spacing={2} bg={priceBg} borderWidth={1} borderRadius="lg" >
                                <VStack>
                                    <Text fontSize={["xs", "sm"]} > {isServiceOwner?'Your':'Seller'} base price: {servicePublicData.price} </Text>
                                </VStack>
                                <VStack p={2} bg={priceBg2} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                                    <Text fontSize={["md", "lg"]} > Quantity: <b>{orderData.details.quantity}</b> </Text>
                                    <Divider borderColor='black.300' />
                                    <Text fontSize={["md", "lg"]} > Total price: <b>RM {totalPrice} </b> </Text>
                                </VStack>
                            </VStack>
                        }
                        <motion.div whileHover={{ scale: 1.1 }} >
                            <VStack p={2} spacing={1} bg={remarksBg} borderWidth={1} borderRadius="lg"  >
                                <Heading as='b' fontSize="lg"> User Remarks </Heading>
                                <Divider borderColor='black.500' />
                                <Text fontSize="md"> {orderData.details.userRemarks} </Text>
                            </VStack>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} >
                            <VStack p={2} spacing={1} bg={addressBg} borderWidth={1} borderRadius="lg"  >
                                <Heading as='b' fontSize="lg"> Address </Heading>
                                <Divider borderColor='black.500' />
                                <Text fontSize="md"> {orderData.details.address} </Text>
                            </VStack>
                        </motion.div>
                    </VStack>
                </Flex>

*/