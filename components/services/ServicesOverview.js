import { useState, useEffect, useRef } from 'react';
//import { useRouter } from 'next/router';
import { getServiceOrders } from '../../lib/db';
import { calculateEventHours } from '../Calendar';
import { MotionBox } from '../MotionElements';
import { Fade } from "react-awesome-reveal";
import { useBreakpointValue, Divider, VStack, HStack, Heading, Button,
Tabs, TabList, TabPanels, Tab, TabPanel,
Menu, MenuButton, MenuList, MenuItemOption, MenuOptionGroup, MenuDivider,
Radio, RadioGroup,
} from '@chakra-ui/react';
import Searching from '../Searching';
import Empty from '../Empty';
import PieChart from './ServicesOverview/PieChart';
import VerticalBar from './ServicesOverview/VerticalBar';
import { IoFilter } from 'react-icons/io5';

export default function ServicesOverview({ fetchingServices, servicesList }) {
    //const [fetchingServicesData, setFetchingServicesData] = useState(true);
    const [servicesData, setServicesData] = useState([]);
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
            flex={5}
            minWidth={0}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <Heading mb={2} p={4} w='100%' color='white' bg='purple' borderWidth={2} borderRadius="lg" boxShadow="lg" fontSize="xl" textAlign='center' >
                    Number of Orders
                </Heading>
                {breakpoint === 'base' ?
                    <Menu isLazy closeOnSelect={true}>
                        <MenuButton as={Button} icon={<IoFilter />} colorScheme="purple">
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
                <Heading mb={2} p={4} w='100%' color='white' bg='purple' borderWidth={2} borderRadius="lg" boxShadow="lg" fontSize="xl" textAlign='center' >
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