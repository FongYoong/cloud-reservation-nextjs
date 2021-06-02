import { MotionBox } from '../MotionElements';
import UserAvatar from '../UserAvatar';
import Ratings from '../Ratings';
import { useBreakpointValue, useColorModeValue, Flex, Box, Divider, Heading, Text, HStack, VStack, Tag, TagRightIcon, TagLabel, IconButton } from "@chakra-ui/react";
import { FaProductHunt, FaHammer, FaArrowAltCircleRight } from 'react-icons/fa';

export default function ReviewCard ({data, ...props}) {

    const dateCreated = new Date(data.dateCreated);
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });
    return (
        <MotionBox p={4}
            bg={useColorModeValue('yellow.50', 'yellow.500')}
            borderWidth={1} borderRadius="md" boxShadow="lg" 
            whileHover={{scale: 1.05} } whileTap={{scale: 0.95}}
            {...props}
        >
            <Flex direction='column' align="center" justify="center" >
                <Flex direction="row" mb={2} align="center" justify="start">
                    <UserAvatar uid={data.clientId} placement='right' />
                    <Flex direction='column' align="center" justify="center" >
                        <Box ml={2} mb={2} minWidth={0} >
                            <Text textAlign='center' fontSize={breakpoint==='base'?"xs":"sm"} >
                                Created at {dateCreated.getHours()}:{dateCreated.getMinutes()}, {dateCreated.toLocaleDateString()}
                            </Text>
                        </Box>
                        <Ratings fixed={true} initialStars={data.stars} />
                    </Flex>
                </Flex>
                <Box minWidth={0} >
                    <Text fontSize="md" lineHeight='normal' wordBreak='break-word' overflowWrap='break-word' > {data.clientReview} </Text>
                </Box>
            </Flex>
        </MotionBox>
    );
}
//// clientId, clientReview, dateCreated, stars