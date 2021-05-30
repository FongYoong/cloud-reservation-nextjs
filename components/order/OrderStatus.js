import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { updateOrder, addServiceReview } from '../../lib/db';
import { motion } from "framer-motion";
import { MotionButton, MotionGetAttention, MotionBox } from '../MotionElements';
import Ratings from '../Ratings';
import UserAvatar from '../UserAvatar';
import { CanvasRain } from '../CanvasRain';
import { Calendar, formatEvents, calculateEventHours, dateIsToday } from '../Calendar';
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
import { MdDelete, MdAttachMoney, MdCheckCircle, MdRateReview, MdStarBorder, MdStar } from 'react-icons/md';

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
        updateOrder(auth, serviceId, orderId, {
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
        updateOrder(auth, serviceId, orderId, {
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
        updateOrder(auth, serviceId, orderId, {
            status: 'paidByUser',
        }, () => {
            toast({
                title: `Succesfully paid for order!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            payModalState.onClose();
        }, () => {
            alert("Firebase Error");
        });
    }
    const completedModalState = useDisclosure();
    const completedHandler = () => {
        setIsLoading(true);
        updateOrder(auth, serviceId, orderId, {
            status: 'completed',
        }, () => {
            toast({
                title: `This order is fulfilled!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            completedModalState.onClose();
        }, () => {
            alert("Firebase Error");
        });
    }
    const [currentStars, setCurrentStars] = useState(0);
    const clientReviewRef = useRef(null);
    const clientReviewModalState = useDisclosure();
    const reviewHandler = () => {
        setIsLoading(true);
        addServiceReview(auth, serviceId, orderId, {
            clientId: orderData.userId,
            stars: currentStars,
            clientReview: clientReviewRef.current.value,
        }, () => {
            toast({
                title: `Your review has been submitted!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            clientReviewModalState.onClose();
        }, () => {
            alert("Firebase Error");
        });
    }

    const sellerRemarksBg = useColorModeValue("purple.100", "purple.500");
    const priceBg = useColorModeValue("green.100", "green.500");
    //const priceBg2 = useColorModeValue("pink.100", "pink.500");
    const remarksBg = useColorModeValue("orange.100", "orange.500");
    const addressBg = useColorModeValue("yellow.100", "yellow.500");
    const calendarBg = useColorModeValue("yellow.50", "orange.400");
    const calendarBg2 = useColorModeValue("yellow.100", "orange.500");
    const todayColor = useColorModeValue('#87b5ff', '#002054');

    useEffect(() => {
        if (!isServiceOwner && !orderData.reviewGiven && clientReviewRef.current) {
            clientReviewRef.current.focus();
        }
    }, [])

    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

    return (
        <MotionBox
            flex={5}
            minWidth={0}
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
                        alt="Rejected"
                    /> </>
                }
                {isServiceOwner && orderData.status === 'paidByUser' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> The user has <Text as='span' color='green.500'> paid </Text> for the order! <span role='img' aria-label="happy">🚀</span> <br />
                                It&apos;s time for work!
                            </b>
                        </Text>
                    </MotionGetAttention>
                    <Img
                        borderRadius="full"
                        boxSize="20vh"
                        src="/images/work.gif"
                        alt="Work"
                    />
                    </>
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
                    <motion.div style={{width:'100%'}} whileHover={{ scale: 1.1 }} >
                        <VStack p={2} bg={sellerRemarksBg} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                            <Text fontSize="md" > Seller remarks: </Text>
                            <Divider borderColor='black.300' />
                            <Text w='100%' fontSize={["md", "lg"]} > <b> {orderData.approvalRemarks} </b> </Text>
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
                    <motion.div style={{width:'100%'}} whileHover={{ scale: 1.1 }} >
                        <VStack p={2} bg={sellerRemarksBg} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                            <Text fontSize="md" > Seller remarks: </Text>
                            <Divider borderColor='black.300' />
                            <Text w='100%' fontSize={["md", "lg"]} > <b> {orderData.approvalRemarks} </b> </Text>
                        </VStack>
                    </motion.div>
                   <Img
                        boxSize="20vh"
                        src="/images/angry.gif"
                        alt="Rejected"
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
                            <b> Payment successful! <span role='img' aria-label="happy">🚀</span> <br/>
                            The seller is <Text as='span' color='orange.500'> now working </Text> on your order! </b>
                        </Text>
                    </MotionGetAttention>
                    <Divider borderColor='black.500' />
                    <Text fontSize="xl" align="center" >
                        <b> <Text as='span' color='green.500'> Click </Text> the button below
                        <Text as='span' color='red.500'> ONLY </Text>
                        after your order is completed by the seller. </b>
                    </Text>
                    <MotionButton icon={<MdCheckCircle />} colorScheme={"green"} onClick={completedModalState.onOpen} >
                        My order has been fulfilled by the seller.
                    </MotionButton> </>
                }
                {orderData.status === 'completed' && <>
                    <MotionGetAttention attentionType='expand'>
                        <Text fontSize="xl" align="center" >
                            <b> The order is <Text as='span' color='green.500'> completed </Text> ! <span role='img' aria-label="happy">😃</span> </b>
                        </Text>
                    </MotionGetAttention>
                    <Img
                        boxSize="20vh"
                        src="/images/happy.gif"
                        alt="Happy"
                    />
                    {!isServiceOwner && !orderData.reviewGiven && <>
                        <Divider borderColor='black.500' />
                        <MotionGetAttention>
                            <Text my={2} fontSize="xl" align="center" >
                                <b> Please leave a review. </b>
                            </Text>
                        </MotionGetAttention>
                        <Ratings onChange={setCurrentStars} />
                        <Textarea borderWidth={2} size="sm" ref={clientReviewRef} defaultValue=''  placeholder="Say something positive!" />
                        <MotionButton icon={<MdRateReview />} colorScheme={"green"}
                            onClick={ () => {
                                if(currentStars > 0) {
                                    clientReviewModalState.onOpen();
                                }
                                else {
                                    toast({
                                    title: `Please choose the number of stars!`,
                                    description: "",
                                    status: "error",
                                    duration: 3000,
                                    isClosable: true,
                                    });
                                }
                            }} >
                            Submit Review
                        </MotionButton> </>
                    }
                    </>
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
                    <OrderDetailsRow noExpand >
                        <Text flex={2}> {isServiceOwner?'Ordered by:':'Seller:'} </Text>
                        <Flex flex={5} p={2} justify={breakpoint==='base'?'center':'start'} >
                            {isServiceOwner? <UserAvatar uid={orderData.userId} placement='right' />
                            : <UserAvatar uid={servicePublicData.ownerId} placement='right' />}
                        </Flex>
                    </OrderDetailsRow>
                    <OrderDetailsRow>
                        <Text flex={2}> Created on: </Text>
                        <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > {new Date(orderData.dateCreated).toDateString()} </Text>
                    </OrderDetailsRow>
                    <OrderDetailsRow>
                        <Text flex={2}> {isServiceOwner?'Your':'Client'} remarks: </Text>
                        <Text flex={5} as='b' whiteSpace="pre-wrap" align={breakpoint==='base'?'center':'left'} >
                            {orderData.details.userRemarks}
                        </Text>
                    </OrderDetailsRow>
                    <OrderDetailsRow>
                        <Text flex={2}> Address: </Text>
                        <Text flex={5} as='b' whiteSpace="pre-wrap" align={breakpoint==='base'?'center':'left'} >
                            {orderData.details.address}
                        </Text>
                    </OrderDetailsRow>
                    {servicePublicData.type === 'service' && <>
                        <OrderDetailsRow>
                            <Text flex={2} > {isServiceOwner?'Your':'Seller'} price range:  </Text>
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {servicePublicData.minPrice.toFixed(2)} ~ {servicePublicData.maxPrice.toFixed(2)} </Text>
                        </OrderDetailsRow>
                        <OrderDetailsRow>
                            <Text flex={2} > {isServiceOwner?"Client's":'Your'} price/hour: </Text>
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {orderData.details.proposedPricePerHour.toFixed(2)} </Text>
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
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {servicePublicData.price.toFixed(2)} </Text>
                        </OrderDetailsRow>
                        <OrderDetailsRow>
                            <Text flex={2} > Quantity: </Text>
                            <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > {orderData.details.quantity} </Text>
                        </OrderDetailsRow>
                        <Divider borderColor='black.300' />
                    </> }
                    <OrderDetailsRow bg={priceBg}>
                        <Text fontSize="lg" flex={2} > Total price: </Text>
                        <Text fontSize="lg" flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {totalPrice.toFixed(2)}  </Text>
                    </OrderDetailsRow>
                </VStack>

                <Divider borderColor='black.500' />
                {servicePublicData.type === 'service' &&
                    <Box p={1} width="100%" _hover={{bg:calendarBg2}} bg={calendarBg} borderWidth={1} borderRadius="lg" >
                        <Calendar
                            dayPropGetter={(date) => ({
                                style: {
                                    backgroundColor: dateIsToday(date) ? todayColor : '',
                                }
                            })}
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
            <Modal initialFocusRef={acceptRemarksRef} motionPreset="scale" closeOnOverlayClick={!isLoading} closeOnEsc={!isLoading} isCentered={true} isOpen={acceptModalState.isOpen} onClose={acceptModalState.onClose}>
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
            <Modal initialFocusRef={rejectRemarksRef} motionPreset="scale" closeOnOverlayClick={!isLoading} closeOnEsc={!isLoading} isCentered={true} isOpen={rejectModalState.isOpen} onClose={rejectModalState.onClose}>
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
            <Modal motionPreset="scale" closeOnOverlayClick={!isLoading} closeOnEsc={!isLoading} isCentered={true} isOpen={payModalState.isOpen} onClose={payModalState.onClose}>
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
            <Modal motionPreset="scale" closeOnOverlayClick={!isLoading} closeOnEsc={!isLoading} isCentered={true} isOpen={completedModalState.isOpen} onClose={completedModalState.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Is your order completed by the seller?</ModalHeader>
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
                            <Button colorScheme="green" mr={3} onClick={completedHandler}>
                                Yes!
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal motionPreset="scale" closeOnOverlayClick={!isLoading} closeOnEsc={!isLoading} isCentered={true} isOpen={clientReviewModalState.isOpen} onClose={clientReviewModalState.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Submit Review?</ModalHeader>
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
                            <Button colorScheme="green" mr={3} onClick={reviewHandler}>
                                Yes!
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </MotionBox>
    )
}

const OrderDetailsRow = ({children, noExpand, ...props}) => {
    return (
        <Box {...props} width="100%" >
            <motion.div whileHover={{ scale: noExpand? 1 : 1.05, backgroundColor: useColorModeValue('#d6ffd6', '#5db65d'), borderRadius: '0.5em' }} >
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