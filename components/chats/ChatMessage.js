
import { useState, useEffect, forwardRef } from 'react';
import { MotionBox } from '../MotionElements';
import { Slide } from "react-awesome-reveal";
import UserAvatar from '../UserAvatar';
import { getUserProfile } from '../../lib/db';
import { useBreakpointValue, useColorModeValue, useDisclosure, Tooltip, Divider, Flex, Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

const ChatMessage = forwardRef(({ sender, content, dateCreated }, ref) => {
    const date = new Date(dateCreated);
    const userBg = "linear(to-b, #809cff, #406aff)";
    const otherBg = "linear(to-b, yellow.50, yellow.200)";
    const breakpoint = useBreakpointValue({ base: "base", 'sm':'sm', 'md':'md', lg: "lg" });
    return (
        <MotionBox ref={ref} w='25vw' m={1} alignSelf={sender==='other'?'flex-start':'flex-end'} whileHover={{ scale: 1.05 } } >
            <Slide duration={500} direction={sender==='other'?'left':'right'} triggerOnce >
                <Tooltip placement="bottom" hasArrow label={date.toString()} >
                    <Flex w='100%' direction='column' p={2} bgGradient={sender==='other'?otherBg:userBg} borderWidth={1} borderColor={sender==='other'?'black':'black'} borderRadius="xl" boxShadow="lg" >
                        <Text whiteSpace='pre-wrap' fontSize={breakpoint==='base'?'sm':'md'} color={sender==='other'?'black':'white'}>
                            {content}
                        </Text>
                        <Text textAlign='right' fontSize={breakpoint==='base'?'xs':'sm'} color={sender==='other'?'gray.500':'gray.300'} >
                            {date.toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true })}
                        </Text>
                    </Flex>
                </Tooltip>
            </Slide>
        </MotionBox>
    )
});

export default ChatMessage;