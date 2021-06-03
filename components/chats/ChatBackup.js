
import { useState, useEffect, useRef } from 'react';
import { AnimateSharedLayout } from "framer-motion";
import { MotionBox, MotionButton } from '../MotionElements';
import { useColorModeValue, useBreakpointValue, Box, Divider, Spinner, Flex, VStack, Textarea } from '@chakra-ui/react';
import ChatMessage from './ChatMessage';
import Empty from '../Empty';
import { MdSend } from 'react-icons/md';

export default function Chat ({ chatData, hasScrolledBefore, setHasScrolledBefore, sendMessageHandler }) {
    const previousFirstMessageRef = useRef(null);
    const firstMessageRef = useRef(null);
    const latestMessageRef = useRef(null);
    useEffect(() => {
        if (latestMessageRef.current) {
            //console.log('scroll check');
            if (hasScrolledBefore) {
                //console.log('scroll to bottom if new message');
                latestMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            else {
                //console.log('first scroll');
                latestMessageRef.current.scrollIntoView({ block: 'start' });
                setHasScrolledBefore(true);
            }
        }
    }, [chatData, latestMessageRef, hasScrolledBefore, setHasScrolledBefore]);
    /*
    useEffect(() => {
        if (hasScrolledBefore) {
            console.log('reiniitalise chat data');
            //latestMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            startIndex.current = chatData && chatData.messages && chatData.messages.length > 10 ? chatData.messages.length - 10 : 0;
            setStartIndexState(startIndex.current);
            previousStartIndex.current = null;
            console.log(latestMessageRef.current);
            chatsYPos.current = null;
            setHasScrolledBefore(false);
        }
    }, [chatData]);*/

    const startIndex = useRef(chatData && chatData.messages && chatData.messages.length > 10 ? chatData.messages.length - 10 : 0);
    const [startIndexState, setStartIndexState] = useState(null);
    const previousStartIndex = useRef(null);
    const chatsYPos = useRef(null);
    const chatsContainerRef = useRef(null);
    const loaderRef = useRef(null);
    useEffect(() => {
         var options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
         };
         const observer = new IntersectionObserver((entities) => handleObserver(entities), options);
         if (loaderRef.current) {
            observer.observe(loaderRef.current)
         }
    }, []);
    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && startIndex.current > 0) {
            //console.log('intersect');
            previousStartIndex.current = startIndex.current;
            if (startIndex.current - 10 >= 0) {
                startIndex.current = startIndex.current - 10;
            }
            else {
                startIndex.current = 0;
            }
            setStartIndexState(startIndex.current);
        }
    }

    useEffect(() => {
        if(chatsContainerRef.current) {
            chatsContainerRef.current.onscroll = () => {
                if (firstMessageRef.current) {
                    chatsYPos.current = chatsContainerRef.current.scrollTop;
                }
            }
        }

    }, [chatsContainerRef]);

    useEffect(() => {
        if (hasScrolledBefore && chatsContainerRef.current && previousFirstMessageRef.current && chatsYPos.current) {
            //console.log('Retain previous scroll position');
            //chatsContainerRef.current.scrollTo(0, previousFirstMessageRef.current);
            //setTimeout(() => previousFirstMessageRef.current.scrollIntoView({ block: 'start' }), 50);
            setTimeout(() => previousFirstMessageRef.current.scrollIntoView({ block: 'start' }), 10);
        }
    }, [startIndexState]);

    const slicedMessages = chatData && chatData.messages ? chatData.messages.slice(startIndex.current) : [];
    const getRef = (index) => {
        console.log('get ref');
        console.log(startIndex.current);
        console.log(previousStartIndex.current);

        if (index === slicedMessages.length - 1) {
            return latestMessageRef;
        }
        else if (index === 0) {
            return firstMessageRef;
        }
        else if (startIndex.current + index === previousStartIndex.current) {
            console.log('theres a previous!')
            return previousFirstMessageRef;
        }
        return null;
    }
    const breakpoint = useBreakpointValue({ base: "base", 'sm':'sm', 'md':'md', lg: "lg" });
    console.log('render');
    return (
        <MotionBox
            flex={5}
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack align='center' justify='space-between' h='80vh' w='100%' p={4}
                bg={useColorModeValue('gray.100', 'gray.500')} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg" >
                <Flex ref={chatsContainerRef} w='100%' h='80%' p={4} direction='column' align='center' justify='space-between' overflowX='hidden'
                    bg={useColorModeValue('purple.800', 'purple.800')} boxShadow="lg" borderWidth={2} borderRadius="lg"
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: '20px',
                            border: '3px solid cyan'
                        },
                    }}
                >
                    <Box ref={loaderRef} >
                        {startIndex.current > 0 ?
                            <Spinner color="white" />
                            :
                            <Box w='6em' h={2} >
                                <Divider borderColor='white' alignSelf={'center'} />
                            </Box>
                        }
                    </Box>
                    <AnimateSharedLayout>
                        {chatData && chatData.messages ? slicedMessages.map((message, i) => (
                            <ChatMessage key={message.dateCreated} ref={ getRef(i) }
                                animate={startIndex.current + i < previousStartIndex.current ? true : false }
                                sender={message.sender} content={message.content} dateCreated={message.dateCreated}
                            />
                        ))
                        : <Empty color='white' />
                        }
                    </AnimateSharedLayout>
                </Flex>
                <Flex w='100%' h='20%' p={2}  bg={useColorModeValue('gray.50', 'gray.600')} boxShadow="lg" borderWidth={2} borderRadius="lg" align='center' justify='center'>
                    <CustomTextArea chatData={chatData} sendMessageHandler={(otherId, message) => {
                        sendMessageHandler(otherId, message);
                    }} breakpoint={breakpoint} />
                </Flex>
            </VStack>
        </MotionBox>
    )
}

const CustomTextArea = ({ chatData, sendMessageHandler, breakpoint }) => {
    const [message, setMessage] = useState('');
    return (
        <>
        <Textarea mr={2} size="sm" placeholder="Type your message here..." value={message}
            onChange={(e) => {
                setMessage(e.target.value);
            }} />
        <MotionButton size={breakpoint==='base'?'xs':'lg'} icon={<MdSend />} colorScheme={"blue"}
            disabled={!message}
            onClick={() => {
                sendMessageHandler(chatData.otherId, message);
                setMessage('');
            } }
        >
            Send
        </MotionButton>
        </>
    )
}