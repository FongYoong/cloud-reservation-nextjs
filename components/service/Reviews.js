import { useBreakpointValue, VStack } from '@chakra-ui/react';
import { MotionBox } from '../MotionElements';
import { Slide } from "react-awesome-reveal";
import ReviewCard from './ReviewCard';
import Empty from '../Empty';

export default function Reviews({reviews}) {
    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });
    return (
       <MotionBox
            flex={5}
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={breakpoint==='base'?0:2} p={breakpoint==='base'?2:4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                {reviews && reviews.length > 0 ?
                <Slide cascade duration={500} direction='right' triggerOnce >
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