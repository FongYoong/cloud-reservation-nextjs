import { useState } from 'react';
import { useRouter } from 'next/router';
import { MotionBox } from '../MotionElements';
import { Flip } from "react-awesome-reveal";
import { Flex, VStack } from '@chakra-ui/react';
import ServiceCard from './ServiceCard';
import Searching from '../Searching';
import Empty from '../Empty';

export default function AllServices({ fetchingServices, servicesList }) {
    const router = useRouter();
    const [targetCardKey, setTargetCardKey] = useState(null);
    return (
        <MotionBox
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                {servicesList && servicesList.length > 0 &&
                    <Flex p={2} w="100%" direction="column" align="start" justify="center">
                        <Flip duration={500} direction='vertical' triggerOnce >
                            {servicesList.map((data, i) => (
                                <ServiceCard mb={4} key={i} shallowData={data} hide={targetCardKey === i}
                                onClick={() => {
                                    setTargetCardKey(i);
                                    router.push(`/services/${data.serviceId}`);
                                }}
                                />
                            ))
                            }
                        </Flip>
                    </Flex>
                }
                {!fetchingServices && (!servicesList || servicesList.length == 0) &&
                    <Empty />
                }
                {fetchingServices &&
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