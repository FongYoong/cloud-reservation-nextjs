import { memo, useState, useEffect } from 'react';
import { MotionBox } from '../MotionElements';
import TextTransition, { presets } from "react-text-transition";
import UserAvatar from '../UserAvatar';
import { getUserProfile } from '../../lib/db';
import { useBreakpointValue, useColorModeValue, Flex, Heading, VStack } from "@chakra-ui/react";

export default memo(function ChatMenuItem ({ selected, uid, latestMessage, ...props }) {
    const [profile, setProfile] = useState({});
    useEffect(() => {
        if (uid) {
            getUserProfile(true, uid, (result) => {setProfile(result)});
        }
    }, [uid]);

    const variants = {
        normal: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            backgroundColor: useColorModeValue('#eed6ff', '#9559ba'),
        },
        selected: {
            scale: 1.1,
            backgroundColor: useColorModeValue('#d6ffd6', '#5db65d'),
            transition:{
                duration: 1,
                ease: "easeInOut",
            },
        }
    }
    const animateState= selected ? 'selected' : 'normal';
    const breakpoint = useBreakpointValue({ base: "base", 'md':'md', lg: "lg" });
    const spring = {
        type: "spring",
        damping: 25,
        stiffness: 120
    };
    return (
        <MotionBox w='90%' m={2} layout transition={spring} variants={variants} animate={animateState} initial='normal' whileHover={{ scale: selected?1.1:1.05 }} whileTap={{ scale: 0.95 }}
            cursor={selected?'auto':'pointer'} borderWidth={2} borderRadius="lg" boxShadow="lg" {...props} >
            <Flex p={2} w='100%' align='center' justify='start'>
                <UserAvatar customProfile={profile} uid={uid} placement='right' />
                <VStack ml={2} align='start' justify='start'>
                    <Heading fontSize='md' >
                        {profile.username}
                    </Heading>
                    {latestMessage &&
                        <TextTransition text={`${latestMessage.sender==='user'?'You: ':''}${latestMessage.content}`}
                            springConfig={ presets.gentle } 
                            style={{
                                width: breakpoint==='base'?'8em':'13vw',
                                display: 'inline-block',
                                fontSize: '0.8em',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }}
                        />
                    }
                </VStack>
            </Flex>
        </MotionBox>
    )
});