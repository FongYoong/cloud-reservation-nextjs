import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MotionBox, MotionButton } from '../MotionElements';
import { Slide } from "react-awesome-reveal";
import { getUserServices } from '../../lib/db';
import { useColorModeValue, Flex, VStack, Divider, Box, Avatar, Heading, Text } from '@chakra-ui/react';
import ServiceCard from '../services/ServiceCard';
import Searching from '../../components/Searching';
import Empty from '../Empty';
import { RiChatSmile3Line } from 'react-icons/ri';

export default function ProfileOverview({uid, sameUser=false, profileData}) {
    const router = useRouter();
    const [servicesList, setServicesList] = useState([]);
    const [fetchingServices, setFetchingServices] = useState(true);
    const [targetCardKey, setTargetCardKey] = useState(null);

    useEffect(() => {
        getUserServices(true, uid, (data) => {
            if (data) {
                const array = Object.keys(data).map((key) => ({
                    serviceId: key, ...data[key]
                }));
                array.reverse();
                setServicesList(array);
            }
            setFetchingServices(false);
        });
    }, [router, uid]);

    return (
        <MotionBox
            flex={5}
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Flex p={2} bg={useColorModeValue('purple.800', 'purple.600')} boxShadow="lg" borderWidth={2} borderRadius="lg" align='center' justify='start' >
                    <VStack m={2} align='center' justify ='center' >
                        <Avatar size='2xl' src={profileData.profile_picture} />
                        {!sameUser &&
                            <MotionButton icon={<RiChatSmile3Line />} colorScheme={"yellow"} onClick={() => {
                                router.push({
                                        pathname: '/chats',
                                        query: { [uid]: '' }
                                    },
                                    undefined, { shallow: true }
                                );
                            }} >
                                Chat
                            </MotionButton>
                        }
                    </VStack>
                    <VStack align='start' justify ='center' >
                        <MotionBox p={4} bg={useColorModeValue('green.100', 'green.500')} borderWidth={2} borderRadius="lg" whileHover={{ scale: 1.1 }} >
                            <Heading fontSize='lg' >
                                {profileData.username}
                            </Heading>
                        </MotionBox>
                        <MotionBox p={4} bg={useColorModeValue('orange.100', 'orange.500')} borderWidth={2} borderRadius="lg" whileHover={{ scale: 1.1 }} >
                            <Text whiteSpace='pre-line' fontSize='lg' >
                                {profileData.description}
                            </Text>
                        </MotionBox>
                    </VStack>
                </Flex>
                <Divider borderColor='black.300' />
                <Box alignSelf='start' p={4} bg={useColorModeValue('purple.800', 'purple.600')} borderWidth={2} borderRadius="lg" >
                    <Heading color='white' fontSize='xl' >
                        Services offered by {profileData.username}
                    </Heading>
                </Box>
                {!fetchingServices ? <>
                    {servicesList && servicesList.length > 0 ?
                        <Flex p={2} w="100%" direction="column" align="start" justify="center">
                            <Slide cascade duration={500} direction='right' triggerOnce >
                                {servicesList.map((data, i) => (
                                    <ServiceCard mb={4} key={i} shallowData={data} hide={targetCardKey === i}
                                    onClick={() => {
                                        setTargetCardKey(i);
                                        router.push(`/services/${data.serviceId}`);
                                    }}
                                    />
                                ))
                                }
                            </Slide>
                        </Flex>
                        : 
                        <Empty />
                    } </>
                    :
                    <Searching />
                }
            </VStack>
        </MotionBox>
    )
}
/*
hide={somethingClicked && targetCardKey !== i}
onClick={() => {
    setTargetCardKey(i);
    setSomethingClicked(true);
    setTimeout(() => router.push(`/services/${data.serviceId}`), 400);
}}
onMouseEnter={ () => {
    setTargetCardKey(i);
    setSomethingHovered(true);
}}
onMouseLeave={ () => {
    setSomethingHovered(false);
}}
*/