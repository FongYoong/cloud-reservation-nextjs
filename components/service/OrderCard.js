import { MotionBox } from '../MotionElements';
import OrderStatusTag from '../OrderStatusTag';
import { useBreakpointValue, useColorModeValue, Flex, Box, Divider, Heading, Text, VStack, IconButton } from "@chakra-ui/react";
import { FaArrowAltCircleRight } from 'react-icons/fa';

export default function OrderCard ({isAllOrdersPage=false, order, hide, ...props}) {

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
    const dateCreated = new Date(order.dateCreated);
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });
    return (
        <MotionBox minWidth={0} p={4} variants={variants} animate={animateState} initial={false} _hover={{cursor: "pointer"}}
            bg={useColorModeValue('purple.50', 'purple.700')}
            borderWidth={1} borderRadius="md" boxShadow="lg" 
            whileHover={{scale: 1.05} } whileTap={{scale: 0.95}}
            {...props}
        >
            <VStack>
                <Flex align='center' justify='space-between' >
                    <Flex flex={5} direction='column' >
                        <Box mt={2} ml={2} minWidth={0} >
                            <Text textAlign='center' fontSize={breakpoint==='base'?"xs":"sm"} >
                                Created at {dateCreated.getHours()}:{dateCreated.getMinutes()}, {dateCreated.toLocaleDateString()}
                            </Text>
                        </Box>
                        <Box minWidth={0} >
                            <Heading fontSize="md" lineHeight='normal' noOfLines={2} wordBreak='break-word' overflowWrap='break-word' >
                                {isAllOrdersPage ? order.name : order.details.userRemarks}
                            </Heading>
                        </Box>
                    </Flex>
                    <IconButton ml={2} size='sm' colorScheme="blue" icon={<FaArrowAltCircleRight />} />
                </Flex>
                <Divider borderColor='black.500' />
                <OrderStatusTag isAllOrdersPage={isAllOrdersPage} uid={isAllOrdersPage ? order.sellerId : order.userId} status={order.status} />
            </VStack>
        </MotionBox>
    );
}