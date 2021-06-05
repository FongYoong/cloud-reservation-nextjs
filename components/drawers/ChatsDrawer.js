import { memo } from 'react';
import { AnimateSharedLayout } from "framer-motion";
import { MotionBox } from '../MotionElements';
import ChatMenuItem from '../chats/ChatMenuItem';
import Searching from '../Searching';
import { useColorModeValue, VStack, Divider, Heading, Flex } from '@chakra-ui/react';

export default memo(function ChatsDrawer({fetchingChats, chats, currentChatIndex, setCurrentChatIndex, drawerState}) {

    const clickHandler = (index) => {
        setCurrentChatIndex(index);
        drawerState.onClose();
    }
    return (
        <MotionBox flex={2} minWidth={0} whileHover={{ scale: 1.05 }} >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading fontSize="xl" mb={2}>
                    Chats
                </Heading>
                <Divider borderColor='black.300' />
                <Flex h='60vh' w='100%' direction='column' align='center' justify='start' overflowX='hidden'
                    bg={useColorModeValue('teal.700', 'teal.700')} boxShadow="lg" borderWidth={2} borderRadius="lg"
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
                <AnimateSharedLayout>
                    {chats && chats.map((otherUser, i) => (
                        <ChatMenuItem selected={i == currentChatIndex} key={otherUser.otherId} uid={otherUser.otherId}
                            latestMessage={otherUser.messages ? otherUser.messages[otherUser.messages.length - 1] : ''}
                            onClick={() => clickHandler(i)}
                        />
                        ))
                    }
                </AnimateSharedLayout>
                </Flex>
                {(fetchingChats) &&
                    <Searching />
                }
            </VStack>
        </MotionBox>
    )
});