import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/router';
import { getServiceOrders } from '../../lib/db';
import { calculateEventHours } from '../Calendar';
import { MotionBox } from '../MotionElements';
import { Fade } from "react-awesome-reveal";
import { useColorModeValue, useBreakpointValue, Box, Divider, VStack, HStack, Heading, Button, Tooltip,
Tabs, TabList, TabPanels, Tab, TabPanel,
Menu, MenuButton, MenuList, MenuItemOption, MenuOptionGroup, MenuDivider,
Radio, RadioGroup,
Table, Thead, Tbody, Tr, Th, Td,
} from '@chakra-ui/react';
import Searching from '../Searching';
import Empty from '../Empty';
import PieChart from '../charts/PieChart';
import VerticalBar from '../charts/VerticalBar';
import { IoFilter } from 'react-icons/io5';
import { MdNavigateNext } from 'react-icons/md';

export default function ServicesOverview({ fetchingServices, servicesList }) {
    const [servicesData, setServicesData] = useState([]);
    const [pendingOrders, setPendingOrders] = useState(null);
    const [workInProgressEvents, setWorkInProgressEvents] = useState(null);
    const [numberOrdersPref, setNumberOrdersPref] = useState('all');
    const [numberOrdersData, setNumberOrdersData] = useState(null);
    const [earningsData, setEarningsData] = useState(null);
    const [colorsArray, setColorsArray] = useState(null);

    useEffect(() => {
        if (servicesList && servicesList.length > 0) {
            setColorsArray(servicesList.map(() => '#' + Math.floor(Math.random()*16777215).toString(16)));
            servicesList.forEach((service) => {
                getServiceOrders(false, service.serviceId, (data) => {
                    if (data) {
                        const array = Object.keys(data).map((key) => ({
                            orderId: key, ...data[key]
                        }));
                        array.reverse();
                        // Add new
                        setServicesData((previous) => ([
                            ...previous, {
                                serviceId: service.serviceId,
                                type: service.type,
                                name: service.name,
                                orders: array
                            }
                        ]));
                    }
                    else {
                        // Add new
                        setServicesData((previous) => ([
                            ...previous, {
                                serviceId: service.serviceId,
                                type: service.type,
                                name: service.name,
                                orders: []
                            }
                        ]));
                    }
                });
            })
        }
    }, [servicesList]);
//
// Process data
// 
    useEffect(() => {
        // pending orders
        const servicesFiltered = servicesData.map((s) => {
            return {
                ...s,
                orders: s.orders.filter((order) => {
                    if (order.status === 'initial') {
                        return true;
                    }
                    return false;
                })
            }
        });
        let array = [];
        servicesFiltered.forEach((s) => {
            const serviceDetails = {
                name: s.name,
                type: s.type,
                serviceId: s.serviceId
            }
            s.orders.forEach((order) => {
                array.push({
                    serviceDetails,
                    orderDetails: order,
                });
            })
        });
        array.sort((a, b) => {
            if (a.orderDetails.dateCreated < b.orderDetails.dateCreated) {
                return -1;
            }
            if (a.orderDetails.dateCreated > b.orderDetails.dateCreated) {
                return 1;
            }
            return 0;
        });
        setPendingOrders(array);
    }, [servicesData]);

    useEffect(() => {
        // work in progress
        const servicesFiltered = servicesData.map((s) => {
            return {
                ...s,
                orders: s.orders.filter((order) => {
                    if (order.status === 'paidByUser') {
                        return true;
                    }
                    return false;
                })
            }
        });
        let array = [];
        servicesFiltered.forEach((s) => {
            const serviceDetails = {
                name: s.name,
                type: s.type,
                serviceId: s.serviceId
            }
            s.orders.forEach((order) => {
                if (s.type === 'service') {
                    order.calendarEvents.forEach((event) => {
                        array.push({
                            serviceDetails,
                            orderDetails: {
                                orderId: order.orderId,
                                dateCreated: event.start,
                                event
                            }
                        });
                    })
                }
                else {
                    array.push({
                        serviceDetails,
                        orderDetails: {
                            orderId: order.orderId,
                            dateCreated: order.dateCreated,
                            quantity: order.details.quantity
                        }
                    });
                }

            })
        });
        array.sort((a, b) => {
            if (a.orderDetails.dateCreated < b.orderDetails.dateCreated) {
                return -1;
            }
            if (a.orderDetails.dateCreated > b.orderDetails.dateCreated) {
                return 1;
            }
            return 0;
        });
        setWorkInProgressEvents(array);
    }, [servicesData]);

    useEffect(() => {
        const numberOrdersFiltered = servicesData.map((s) => {
            return {
                ...s,
                orders: s.orders.filter((order) => {
                    if (numberOrdersPref === 'all') {
                        return true;
                    }
                    else if (order.status === numberOrdersPref) {
                        return true;
                    }
                    return false;
                })
            }
        });
        setNumberOrdersData({
            labels: servicesData.map((s) => s.name),
            datasets: [
                {
                    label: 'No. of Orders per service',
                    data: numberOrdersFiltered.map((s) => s.orders.length),
                    backgroundColor: colorsArray,
                    borderWidth: 1,
                },
            ],
        });
    }, [servicesData, numberOrdersPref]);

    useEffect(() => {
        const earningsFiltered = servicesData.map((s) => {
            return {
                ...s,
                orders: s.orders.filter((order) => {
                    if (order.status === 'completed') {
                        return true;
                    }
                    return false;
                })
            }
        });
        const earningsArray = earningsFiltered.map((s) => {
            return s.orders.reduce((previousEarnings, currentOrder) => {
                let total = 0;
                if (s.type === 'service') {
                    total += calculateEventHours(currentOrder.calendarEvents) * currentOrder.details.proposedPricePerHour;
                }
                else {
                    total += currentOrder.details.quantity * currentOrder.details.price;
                }

                return previousEarnings + total;
            }, 0);
        });
        setEarningsData({
            labels: servicesData.map((s) => s.name),
            datasets: [
                {
                    label: 'Earnings per service',
                    data: earningsArray,
                    backgroundColor: colorsArray,
                    borderWidth: 1,
                },
            ],
        });
    }, [servicesData]);

    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });
    return (
        <MotionBox
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading mb={2} p={4} w='100%' color='white' bgGradient="linear(to-r, #085078, #85D8CE)" borderRadius="lg" boxShadow="lg" fontSize="xl" textAlign='center' >
                    Pending Confirmations
                </Heading>
                <Box maxHeight={breakpoint === 'base'?'100vh':'40vh'} w='100%' overflowX='auto' overflowY='auto'
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: '20px',
                            border: '3px solid gray'
                        },
                    }}
                >
                    <Table size={breakpoint === 'base'?'sm':'md'} variant="simple" width='100%' p={2} rounded={{ md: 'lg' }} borderWidth={2} boxShadow="lg" >
                        <Thead>
                            <PendingRow noExpand isHead />
                        </Thead>
                        <Tbody>
                            {pendingOrders && pendingOrders.map((e) => (
                                <PendingRow key={e.orderDetails.orderId + e.orderDetails.dateCreated}
                                    serviceDetails={e.serviceDetails}
                                    orderDetails={e.orderDetails} />
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Heading mb={2} p={4} w='100%' color='white' bgGradient="linear(to-r, #5C258D, #4389A2)" borderRadius="lg" boxShadow="lg" fontSize="xl" textAlign='center' >
                    Work In Progress
                </Heading>
                <Box maxHeight={breakpoint === 'base'?'100vh':'40vh'} w='100%' overflowX='auto' overflowY='auto'
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: '20px',
                            border: '3px solid gray'
                        },
                    }}
                >
                    <Table size={breakpoint === 'base'?'sm':'md'} variant="simple" width='100%' p={2} rounded={{ md: 'lg' }} borderWidth={2} boxShadow="lg" >
                        <Thead>
                            <WIPRow noExpand isHead />
                        </Thead>
                        <Tbody>
                            {workInProgressEvents && workInProgressEvents.map((e) => (
                                <WIPRow key={e.orderDetails.orderId + e.orderDetails.dateCreated}
                                    serviceDetails={e.serviceDetails}
                                    orderDetails={e.orderDetails} />
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Heading mb={2} p={4} w='100%' color='white' bgGradient="linear(to-r, #360033, #0b8793)" borderRadius="lg" boxShadow="lg" fontSize="xl" textAlign='center' >
                    Number of Orders
                </Heading>
                {breakpoint === 'base' ?
                    <Menu isLazy closeOnSelect={true}>
                        <MenuButton as={Button} leftIcon={<IoFilter />} colorScheme="pink">
                            Filter
                        </MenuButton>
                        <MenuList>
                            <MenuOptionGroup onChange={(value) => setNumberOrdersPref(value)} defaultValue={numberOrdersPref} title="" type="radio">
                                <MenuItemOption value="all">All</MenuItemOption>
                                <MenuItemOption value="accepted">Awaiting Client Payment</MenuItemOption>
                                <MenuItemOption value="rejected">Rejected</MenuItemOption>
                                <MenuItemOption value="paidByUser">Work In Progress</MenuItemOption>
                                <MenuItemOption value="completed">Completed</MenuItemOption>
                            </MenuOptionGroup>
                            <MenuDivider />
                        </MenuList>
                    </Menu>
                    :
                    <RadioGroup onChange={(value) => setNumberOrdersPref(value)} defaultValue="all">
                        <HStack spacing={5} direction="row">
                            <Radio colorScheme="purple" value="all">
                                All
                            </Radio>
                            <Radio colorScheme="purple" value="accepted">
                                Awaiting Client Payment
                            </Radio>
                            <Radio colorScheme="purple" value="rejected">
                                Rejected
                            </Radio>
                            <Radio colorScheme="purple" value="paidByUser">
                                Work In Progress
                            </Radio>
                            <Radio colorScheme="purple" value="completed">
                                Completed
                            </Radio>
                        </HStack>
                    </RadioGroup>
                }
                <Tabs isLazy isFitted width={breakpoint==='base'?'100%':'70%'} variant="solid-rounded" colorScheme="purple">
                    <TabList>
                        <Tab>Vertical Bar Chart</Tab>
                        <Tab>Pie Chart</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Fade duration={500} style={{width:'100%'}} >
                                <VerticalBar data={numberOrdersData} callback={(value, index) => {
                                    return value % 1 === 0 ? value : '';
                                }} />
                            </Fade>
                        </TabPanel>
                        <TabPanel>
                            <Fade duration={500} style={{width:'100%'}} >
                                <PieChart data={numberOrdersData} width={breakpoint==='base'?'100%':'70%'} />
                            </Fade>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <Divider borderColor='black.300' />
                <Heading mb={2} p={4} w='100%' color='white' bg='purple' bgGradient="linear(to-r, #5f2c82, #49a09d)" borderRadius="lg" boxShadow="lg" fontSize="xl" textAlign='center' >
                    Total Earnings (RM)
                </Heading>
                <Tabs isLazy isFitted width={breakpoint==='base'?'100%':'70%'} variant="solid-rounded" colorScheme="purple">
                    <TabList>
                        <Tab>Vertical Bar Chart</Tab>
                        <Tab>Pie Chart</Tab>
                    </TabList>
                    <TabPanels>
                       <TabPanel>
                            <Fade duration={500} style={{width:'100%'}} >
                                <VerticalBar data={earningsData} callback={(value, index) => {
                                    return 'RM' + value;
                                }} />
                            </Fade>
                        </TabPanel>
                        <TabPanel>
                            <Fade duration={500} style={{width:'100%'}} >
                                <PieChart data={earningsData} width={breakpoint==='base'?'100%':'70%'} callback={(value, index) => {
                                    return 'RM' + value;
                                }} />
                            </Fade>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
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
// eslint-disable-next-line react/display-name
const PendingRow = memo(({noExpand, isHead=false, serviceDetails, orderDetails, ...props}) => {
    const router = useRouter();
    const dateCreated = isHead ? null : new Date(orderDetails.dateCreated);
    return (
        <MotionBox as={Tr} w='100%'
            whileHover={{ scale: noExpand? 1 : 1, backgroundColor: useColorModeValue('#d6ffd6', '#5db65d'), borderRadius: '0.5em' }} {...props} >
            {isHead && <>
                <Th>Date Created</Th>
                <Th>Service</Th>
                <Th>Info</Th>
                <Th>User Remarks</Th>
                <Th></Th>
                </>
            }
            {!isHead && <>
                <Td>
                    {dateCreated.toDateString()}, {dateCreated.toLocaleTimeString()}
                </Td>
                <Td>
                    <Tooltip placement="top" hasArrow label={`View ${serviceDetails.type === 'service' ? 'Service':'Product'}`} >
                        <Button rightIcon={<MdNavigateNext />} lineHeight='normal' colorScheme="purple" fontSize="sm" isTruncated
                            onClick={ () => router.push(`/services/${serviceDetails.serviceId}`) }>
                            {serviceDetails.name}
                        </Button>
                    </Tooltip>
                </Td>
                {serviceDetails.type === 'service' ?
                    <Td>{ calculateEventHours(orderDetails.calendarEvents) } hours </Td>
                    :
                    <Td> Quantity: { orderDetails.details.quantity } </Td>
                }
                <Td> 
                    {orderDetails.details.userRemarks}
                </Td>
                <Td>
                    <Tooltip placement="top" hasArrow label={`View Order`} >
                        <Button rightIcon={<MdNavigateNext />} lineHeight='normal' colorScheme="green" fontSize="lg" isTruncated
                            onClick={ () => router.push(`/orders/${serviceDetails.serviceId}/${orderDetails.orderId}`) }>
                            View
                        </Button>
                    </Tooltip>
                </Td>
                </>
            }
        </MotionBox>
    )
});

// eslint-disable-next-line react/display-name
const WIPRow = memo(({noExpand, isHead=false, serviceDetails, orderDetails, ...props}) => {
    const router = useRouter();
    const start = new Date(isHead || serviceDetails.type === 'product' ? 0 : orderDetails.event.start);
    const end = new Date(isHead || serviceDetails.type === 'product' ? 0 : orderDetails.event.end);
    return (
        <MotionBox as={Tr} w='100%'
            whileHover={{ scale: noExpand? 1 : 1, backgroundColor: useColorModeValue('#d6ffd6', '#5db65d'), borderRadius: '0.5em' }} {...props} >
            {isHead && <>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Info</Th>
                <Th>Service</Th>
                <Th></Th>
                </>
            }
            {!isHead && <>
                {serviceDetails.type === 'service' ? <>
                    <Td>{ start.toDateString() }</Td>
                    <Td>{ start.toLocaleTimeString() } - { end.toLocaleTimeString() }</Td>
                    <Td>{orderDetails.event.title}</Td>
                    </>
                    :
                    <>
                    <Td>{ (new Date(orderDetails.dateCreated)).toDateString() }</Td>
                    <Td>  Ship as fast as possible! </Td>
                    <Td> Quantity: { orderDetails.quantity } </Td>
                    </>
                }
                <Td>
                    <Tooltip placement="top" hasArrow label={`View ${serviceDetails.type === 'service' ? 'Service':'Product'}`} >
                        <Button rightIcon={<MdNavigateNext />} lineHeight='normal' colorScheme="purple" fontSize="sm" isTruncated
                            onClick={ () => router.push(`/services/${serviceDetails.serviceId}`) }>
                            {serviceDetails.name}
                        </Button>
                    </Tooltip>
                </Td>
                <Td>
                    <Tooltip placement="top" hasArrow label={'View Order'} >
                        <Button rightIcon={<MdNavigateNext />} lineHeight='normal' colorScheme="green" fontSize="lg" isTruncated
                            onClick={ () => router.push(`/orders/${serviceDetails.serviceId}/${orderDetails.orderId}`) }>
                            View
                        </Button>
                    </Tooltip>
                </Td>
                </>
            }
        </MotionBox>
    )
});