
import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { AnimateSharedLayout } from "framer-motion";
import { MotionBox, MotionButton } from '../MotionElements';
import { useColorModeValue, useBreakpointValue, Box, Divider, Spinner, Flex, VStack, Textarea } from '@chakra-ui/react';
import ChatMessage from './ChatMessage';
const Empty = dynamic(() => import('../Empty'));
import { MdSend } from 'react-icons/md';

export default function Chat ({ chatData, sendMessageHandler, hasScrolledBefore, setHasScrolledBefore }) {

    const [startIndex, setStartIndex] = useState(chatData && chatData.messages && chatData.messages.length > 10 ? chatData.messages.length - 10 : 0);
    const previousStartIndex = useRef(startIndex);
    const bottomRef = useRef(null);
    useEffect(() => {
        //console.log('scroll check');
        if (bottomRef.current) {
            if (hasScrolledBefore) {
                //console.log('scroll to bottom if new message');
                bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            else {
                //console.log('first scroll');
                bottomRef.current.scrollIntoView({ block: 'start' });
                setHasScrolledBefore(true);
            }
        }
    }, [chatData, bottomRef, hasScrolledBefore, setHasScrolledBefore]);
    const fetchMoreMessages = () => {
        //console.log('fetch more');
        previousStartIndex.current = startIndex;
        if (startIndex - 10 >= 0) {
            setStartIndex(startIndex - 10);
        }
        else {
            setStartIndex(0);
        }
    }
    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading: false,
        hasNextPage: startIndex > 0,
        onLoadMore: fetchMoreMessages,
        disabled: false,
        rootMargin: '400px 0px 0px 0px',
    });
    const scrollableRootRef = useRef(null);
    const lastScrollDistanceToBottomRef = useRef(null);
    useEffect(() => {
        const scrollableRoot = scrollableRootRef.current;
        const lastScrollDistanceToBottom =
        lastScrollDistanceToBottomRef.current ?? 0;
        if (scrollableRoot) {
            scrollableRoot.scrollTop = scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
        }
    }, [startIndex, rootRef]);

    const rootRefSetter = useCallback(
        (node) => {
            rootRef(node);
            scrollableRootRef.current = node;
        },
        [rootRef],
    );

    const handleRootScroll = useCallback(() => {
        const rootNode = scrollableRootRef.current;
        if (rootNode) {
            const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
            lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
        }
    }, []);

    const slicedMessages = chatData && chatData.messages ? chatData.messages.slice(startIndex) : [];

    const breakpoint = useBreakpointValue({ base: "base", 'sm':'sm', 'md':'md', lg: "lg" });
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
                <Flex ref={rootRefSetter} onScroll={handleRootScroll}
                    w='100%' h='80%' p={4} direction='column' align='center' justify='space-between' overflowX='hidden'
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
                        <Box ref={sentryRef} >
                            {startIndex > 0 ?
                                <Spinner color="white" />
                                :
                                <Box w='6em' h={2} >
                                    <Divider borderColor='white' alignSelf={'center'} />
                                </Box>
                            }
                        </Box>
                        <AnimateSharedLayout>
                            {chatData && chatData.messages ? slicedMessages.map((message) => (
                                <ChatMessage key={message.dateCreated} animate={true}
                                    sender={message.sender} content={message.content} dateCreated={message.dateCreated}
                                />
                            ))
                            : <Empty color='white' />
                            }
                        </AnimateSharedLayout>
                        <Box ref={bottomRef} />
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
// startIndex + i < previousStartIndex.current ? true : false

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