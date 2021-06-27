import {useState} from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { MotionBox } from '../MotionElements';
import UserAvatar from '../UserAvatar';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { days, transformAvailableDays } from '../Calendar';
import { useBreakpointValue, useColorModeValue, Flex, Box, VStack, Text, Tag, TagLabel, TagRightIcon } from '@chakra-ui/react';
import { FaProductHunt, FaHammer } from 'react-icons/fa';

export default function ServiceOverview({publicData}) {
    const [availableDays, _] = useState(publicData.availableDays ? transformAvailableDays(publicData.availableDays).map((i)=>days[i]).join(', ') : null);
    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });

    let w = 533;
    let h = 300;
    if (breakpoint === 'base') {
        w = 267;
        h = 150;
    }

    let images = publicData.imageUrls ? publicData.imageUrls.map((url) => ({
        original: url,
        thumbnail: url,
        renderItem: CustomImage,
        w, h
    })) : [];

    if (publicData.videoUrl) {
        images.unshift({
            original: publicData.videoUrl,
            thumbnail: '/images/video_icon.png',
            renderItem: VideoPlayer,
            w, h
        })
    }
    else if (!publicData.imageUrls) {
        images.push({
            original: '/images/no_image.jpg',
            thumbnail: '/images/no_image.jpg',
            renderItem: CustomImage,
            w, h
        })
    }
    return (
        <MotionBox
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={breakpoint==='base'?0:2} p={breakpoint==='base'?2:4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <ImageGallery slideOnThumbnailOver={false} showIndex={true} showPlayButton={false} items={images} />
                <VStack width={breakpoint==='base'?'100%':'50%'} p={2} bg={useColorModeValue('white', 'gray.700')} rounded={{ md: 'lg' }} borderWidth={2} boxShadow="lg" >
                    <Flex p={2} width="100%" align="center" justify="start" borderBottomWidth={1}>
                        <Box flex={3} >
                            {publicData.type === 'service' ?
                            <Tag size='lg' colorScheme="teal">
                                <TagLabel>Service</TagLabel>
                                <TagRightIcon as={FaHammer} />
                            </Tag>
                            :
                            <Tag size='lg' colorScheme="pink">
                                <TagLabel>Product</TagLabel>
                                <TagRightIcon as={FaProductHunt} />
                            </Tag>
                            }
                        </Box>
                        <Box flex={1} />
                    </Flex>
                    <ServiceDetailsRow>
                        <Text flex={2}> Name: </Text>
                        <Text flex={5} wordBreak='break-word' as='b' align={breakpoint==='base'?'center':'left'} > {publicData.name} </Text>
                    </ServiceDetailsRow>
                    <ServiceDetailsRow>
                        <Text flex={2}> Description: </Text>
                        <Text flex={5} whiteSpace='pre-line' wordBreak='break-word' as='b' align={breakpoint==='base'?'center':'left'} > {publicData.description} </Text>
                    </ServiceDetailsRow>
                    <ServiceDetailsRow>
                    {publicData.type === 'service' ? <>
                        <Text flex={2} > Price range: </Text>
                        <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {publicData.minPrice.toFixed(2)} ~ {publicData.maxPrice.toFixed(2)} </Text>
                        </> : <>
                        <Text flex={2} > Price per item:  </Text>
                        <Text flex={5} as='b' align={breakpoint==='base'?'center':'left'} > RM {publicData.price.toFixed(2)} </Text>
                        </>
                    }
                    </ServiceDetailsRow>
                    {publicData.type === 'service' &&
                        <ServiceDetailsRow>
                            <Text flex={2}> Available days: </Text>
                            <Text flex={5} wordBreak='break-word' as='b' align={breakpoint==='base'?'center':'left'} > {availableDays} </Text>
                        </ServiceDetailsRow>
                    }
                    <ServiceDetailsRow noExpand >
                        <Text flex={2}> Seller: </Text>
                        <Flex flex={5} p={2} justify={breakpoint==='base'?'center':'start'} >
                            <UserAvatar uid={publicData.ownerId} placement='right' />
                        </Flex>
                    </ServiceDetailsRow>
                </VStack>
            </VStack>
        </MotionBox>
    )
}

const CustomImage = ({original, w, h}) => {
    return (
        <Flex justify='center' w='100%' >
            <Box borderRadius="md" overflow="hidden" bg="white" lineHeight="0" >
                <Image
                    priority={true}
                    width={w}
                    height={h}
                    objectFit="contain"
                    src={original}
                    alt='Image'
                />
            </Box>
        </Flex>
    )
}
/*
<Flex justify='center' w='100%' >
    <Box w={w} h={h} >
        <Img
            w='100%'
            h='100%'
            objectFit='contain'
            borderRadius="md"
            src={original}
            alt="Image"
        />
    </Box>
</Flex>
*/

const VideoPlayer = ({original, w, h}) => {
    return (
        <Flex justify='center' w='100%' >
            <Box w={w} h={h} mx='3em' >
                <video style={{
                    width: '100%',
                    height: '100%',
                }}
                controls={true} autoPlay={false}>
                    <source src={original} type="video/mp4" />
                    <track src="" kind="captions" />
                </video>
            </Box>
        </Flex>
    )
}

const ServiceDetailsRow = ({children, noExpand, ...props}) => {
    return (
        <Box {...props} width="100%" >
            <motion.div whileHover={{ scale: noExpand? 1 : 1.05, backgroundColor: useColorModeValue('#d6ffd6', '#5db65d'), borderRadius: '0.5em' }} >
                <Flex flexWrap='wrap' px={4} py={2} align="center" justify="center" >
                    {children}
                </Flex>
            </motion.div>
        </Box>
    )
}