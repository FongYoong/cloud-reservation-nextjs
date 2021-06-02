import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { MotionBox } from '../MotionElements';
import { getServicePublicDetails } from '../../lib/db';
import { useColorModeValue, useBreakpointValue, Flex, Box, Img, Divider, Heading, Text, VStack, Tag, TagRightIcon, TagLabel, Stat, StatNumber } from "@chakra-ui/react";
import UserAvatar from '../../components/UserAvatar';
import { FaProductHunt, FaHammer } from 'react-icons/fa';

export default function ServiceCard ({shallowData, blur, k, hide, ...props}) {
    const [fetchingData, setFetchingData] = useState(true);
    const [publicData, setPublicData] = useState(null);
    useEffect(() => {
    getServicePublicDetails(shallowData.serviceId, (data) => {
        setPublicData(data);
        setFetchingData(false);
    });
    }, [shallowData.serviceId]);
    const variants = {
        normal: {
            scale: 1,
            rotate: 0,
            opacity: 1,
        },
        hide: {
            scale: 0,
            rotate: 360,
            transition:{
                duration: 0.5,
                ease: "easeInOut",
            },
        }
    }
    const animateState = hide ? 'hide' : 'normal';
    const breakpoint = useBreakpointValue({ base: "base", sm:'sm', md: "md", lg: "lg" });

    return (
        <MotionBox m={2} variants={variants} animate={animateState} initial={false} _hover={{cursor: "pointer"}}
            w={breakpoint==='base'?'90%':'18em'}
            h={'24em'}
            __css={{
                filter: blur?'blur(2px)':'',
            }}
            whileHover={{scale: 1.05} } whileTap={{scale: 0.95}}
            {...props}
        >
            <VStack w="100%" h='100%' p={2} bg={useColorModeValue('white', 'gray.700')} borderWidth={1} borderRadius="lg" boxShadow="lg" >
                {!fetchingData && <>
                    <MediaPreview w="100%" h='60%' imageUrls={publicData.imageUrls} videoUrl={publicData.videoUrl} />
                    <VStack w='100%' h='40%' align="center" justify="space-evenly" >
                        <Flex w='100%' h='40%' align="center" justify="space-between">
                            {publicData.type === 'service' ?
                            <Tag flex={2} size='sm' colorScheme="teal">
                                <TagLabel>Service</TagLabel>
                                <TagRightIcon as={FaHammer} />
                            </Tag>
                            :
                            <Tag flex={2} size='sm' colorScheme="pink">
                                <TagLabel>Product</TagLabel>
                                <TagRightIcon as={FaProductHunt} />
                            </Tag>
                            }
                            <Box flex={5} minWidth={0} >
                                <Heading textAlign="center" fontSize="md" wordBreak='break-word' lineHeight='normal' noOfLines={2} > {shallowData.name} </Heading>
                            </Box>
                        </Flex>
                        <Divider borderColor='black.300' />
                        <Flex w='100%' h='60%' align="center" justify="space-between" >
                            <VStack flex={3}>
                                {publicData.type === 'service' ?
                                    <Stat size='sm' p={2} borderWidth={2} borderRadius="lg">
                                        <StatNumber  >RM {publicData.minPrice.toFixed(2)} ~ {publicData.maxPrice.toFixed(2)}</StatNumber>
                                    </Stat>
                                    :
                                    <Stat size='sm' p={2} borderWidth={2} borderRadius="lg">
                                        <StatNumber>RM {publicData.price.toFixed(2)}</StatNumber>
                                    </Stat>
                                }
                                <Text fontSize="sm" > Created on: {(new Date(shallowData.dateCreated)).toLocaleDateString()} </Text>
                            </VStack>
                            <UserAvatar flex={1} uid={shallowData.ownerId} flip={false} placement='bottom' />
                        </Flex>
                    </VStack>
                </>
                }
            </VStack>
        </MotionBox>
    );
}

const MediaPreview = ({imageUrls, videoUrl, ...props}) => {
    const playerRef = useRef();
    const [animateState, setAnimateState] = useState('normal');
    const variants = {
        normal: {
            opacity: 1,
            transition:{
                duration: 0.5,
                type: "easeInOut",
            },
        },
        hide: {
            opacity: 0,
            transition:{
                duration: 0.5,
                type: "easeInOut",
            },
        },
    } // imageUrls ? imageUrls[0] : ''
    return (
        <Box position='relative' borderWidth={1} borderRadius="sm" {...props} >
            <Box w='100%' h='100%'>
                {videoUrl ?
                    <video style={{
                        width: '100%',
                        height: '100%',
                    }}
                    ref={playerRef} controls={false} autoPlay={false}>
                        <source src={videoUrl} type="video/mp4" />
                        <track src="" kind="captions" />
                    </video>
                    :
                    <Img
                        w='100%'
                        h='100%'
                        objectFit='fill'
                        borderRadius="sm"
                        src={imageUrls && imageUrls[1] ? imageUrls[1] : '/images/cat_hands.gif'}
                        alt="Alternative Preview"
                    /> }
            </Box>
            <motion.div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 50,
            }} variants={variants} animate={animateState}
                onMouseEnter={ () => {
                    setAnimateState('hide');
                    if (playerRef.current){
                        playerRef.current.play();
                    }
                }}
                onMouseLeave={ () => {
                    setAnimateState('normal');
                    if (playerRef.current){
                        playerRef.current.currentTime = 0;
                        playerRef.current.pause();
                    }
                }} >
                <Img
                    w='100%'
                    h='100%'
                    objectFit='fill'
                    borderRadius="sm"
                    src={imageUrls ? imageUrls[0] : '/images/no_image.jpg'}
                    alt="Photo"
                />
            </motion.div>
        </Box>
    )
}