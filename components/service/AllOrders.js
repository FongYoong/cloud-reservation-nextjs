import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { MotionBox } from '../MotionElements';
import { Flip } from "react-awesome-reveal";
import { Flex, VStack } from '@chakra-ui/react';
import OrderCard from './OrderCard';
import Searching from '../Searching';
const Empty = dynamic(() => import('../Empty'));

export default function AllOrders({fetchingOrders, serviceId, ordersList, auth}) {
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
            <VStack w='100%' m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                {ordersList && ordersList.length > 0 ?
                    <Flex p={2} w="100%" direction="column" align="start" justify="center">
                        <Flip duration={500} direction='vertical' triggerOnce >
                            {ordersList.map((data, i) => (
                                <OrderCard mb={4} key={i} order={data} hide={targetCardKey === i}
                                onClick={() => {
                                    setTargetCardKey(i);
                                    router.push(`/orders/${serviceId}/${data.orderId}`);
                                }}
                                />
                            ))
                            }
                        </Flip>
                    </Flex>
                    :
                    (fetchingOrders ? <Searching text='Obtaining orders...' /> : <Empty />)
                }
            </VStack>
        </MotionBox>
    )
}