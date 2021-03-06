import { useBreakpointValue, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { MotionBox } from '../MotionElements';
import { Slide } from "react-awesome-reveal";
import ReviewCard from './ReviewCard';
const Empty = dynamic(() => import('../Empty'));

export default function Reviews({reviews}) {
    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });
    return (
       <MotionBox
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={breakpoint==='base'?0:2} p={breakpoint==='base'?2:4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                {reviews && reviews.length > 0 ?
                <Slide duration={500} direction='up' triggerOnce >
                    {reviews.map((data, i) => (
                        <ReviewCard mb={4} key={i} data={data}  />
                    ))
                    }
                </Slide>
                :
                <Empty/>
                }
            </VStack>
        </MotionBox>
    )
}