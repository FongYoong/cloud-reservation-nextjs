
import { useState, useEffect, useRef } from 'react';
import { MotionBox, MotionButton } from '../MotionElements';
import { useColorModeValue, useBreakpointValue, Flex, VStack, Textarea } from '@chakra-ui/react';
import ChatMessage from './ChatMessage';
import Empty from '../Empty';
import { MdSend } from 'react-icons/md';

export default function Chat ({ chatData, hasScrolledBefore, setHasScrolledBefore, sendMessageHandler }) {
    const latestMessageRef = useRef(null);
    useEffect(() => {
        if (latestMessageRef.current) {
            if (hasScrolledBefore) {
                latestMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            else {
                latestMessageRef.current.scrollIntoView({ block: 'start' });
                setHasScrolledBefore(true);
            }
        }
    }, [chatData, latestMessageRef, hasScrolledBefore, setHasScrolledBefore]);

    // otherId, dateCreated, sender('user' or 'other'), content
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
                <Flex w='100%' h='80%' p={4} direction='column' align='center' justify='space-between' overflowX='hidden'
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
                    {chatData && chatData.messages ? chatData.messages.map((message, i) => (
                        <ChatMessage key={i} ref={ chatData.messages.length - 1 === i ? latestMessageRef : null }
                            sender={message.sender} content={message.content} dateCreated={message.dateCreated}
                        />
                    ))
                       : <Empty color='white' />
                    }
                </Flex>
                <Flex w='100%' h='20%' p={2}  bg={useColorModeValue('gray.50', 'gray.600')} boxShadow="lg" borderWidth={2} borderRadius="lg" align='center' justify='center'>
                    <CustomTextArea chatData={chatData} sendMessageHandler={sendMessageHandler} breakpoint={breakpoint} />
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