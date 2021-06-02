import { MotionBox } from '../MotionElements';
import { useBreakpointValue, useColorModeValue, Flex, Box, Divider, Heading, Text, HStack, VStack, Tag, TagRightIcon, TagLabel, IconButton } from "@chakra-ui/react";
import { FaProductHunt, FaHammer, FaArrowAltCircleRight } from 'react-icons/fa';

export default function ServiceCard ({shallowData, hide, ...props}) {

    const variants = {
        normal: {
            scale: 1,
            rotate: 0,
            opacity: 1,
        },
        hide: {
            scale: 0,
            x:2000,
            transition:{
                duration: 0.5,
                ease: "easeInOut",
            },
        }
    }
    const animateState = hide ? 'hide' : 'normal';
    const dateCreated = new Date(shallowData.dateCreated);
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });
    return (
        <MotionBox p={4} variants={variants} animate={animateState} initial={false} _hover={{cursor: "pointer"}}
            bg={useColorModeValue('green.50', 'green.700')}
            borderWidth={1} borderRadius="md" boxShadow="lg" 
            whileHover={{scale: 1.05} } whileTap={{scale: 0.95}}
            {...props}
        >
            <Flex align='center' justify='space-between' >
                <Flex flex={5} direction='column' >
                    <Flex direction={breakpoint==='base'?"column":"row"} mb={2} align="center" justify="start">
                        {shallowData.type === 'service' ?
                        <Tag minWidth='7em' size='sm' colorScheme="teal">
                            <TagLabel>Service</TagLabel>
                            <TagRightIcon as={FaHammer} />
                        </Tag>
                        :
                        <Tag minWidth='7em' size='sm' colorScheme="pink">
                            <TagLabel>Product</TagLabel>
                            <TagRightIcon as={FaProductHunt} />
                        </Tag>
                        }
                        <Box ml={2} minWidth={0} >
                            <Text textAlign='center' fontSize={breakpoint==='base'?"xs":"sm"} >
                                Created at {dateCreated.getHours()}:{dateCreated.getMinutes()}, {dateCreated.toLocaleDateString()}
                            </Text>
                        </Box>
                    </Flex>
                    <Box minWidth={0} >
                        <Heading fontSize="md" lineHeight='normal' noOfLines={2} wordBreak='break-word' overflowWrap='break-word' > {shallowData.name} </Heading>
                    </Box>
                </Flex>
                <IconButton ml={2} size='sm' colorScheme="blue" icon={<FaArrowAltCircleRight />} />
            </Flex>
        </MotionBox>
    );
}