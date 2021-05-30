import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getServicePublicDetails, getOrderDetails } from '../../lib/db';
import { AnimatePresence } from "framer-motion";
import { useBreakpointValue, useDisclosure, useToast, ScaleFade, Heading, Box, Button, VStack, Flex } from "@chakra-ui/react";
import Searching from '../../components/Searching';
import NotFound from '../../components/NotFound';
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import OrderDrawer from '../../components/drawers/OrderDrawer';
import OrderStatus from '../../components/order/OrderStatus';

export default function Order () {
    // Only can view if owner of order or owner of service
    const router = useRouter();
    const slug = router.query.slug;
    // http://localhost:3000/orders/-MaPTTtZR88pljfYJFh3/-MaanMeEBWxjbJDRfMMK
    const [serviceId, setServiceId] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const { auth, loading } = useAuth();
    const [fetchingData, setFetchingData] = useState(true);
    const [servicePublicData, setServicePublicData] = useState(null);
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        if (slug) {
            if (slug.length === 2) {
                setServiceId(slug[0]);
                setOrderId(slug[1]);
            }
            else {
                router.replace(`/orders`);
            }
        }
    }, [slug]);

    useEffect(() => {
        if (!loading && !auth) {
            router.replace('/marketplace');
        }
    }, [auth, loading, router]);

    useEffect(() => {
        if (serviceId) {
            getServicePublicDetails(serviceId, (data) => {
                setServicePublicData(data);
                if (orderId) {
                    getOrderDetails(true, serviceId, orderId, (data) => {
                        setOrderData(data);
                        setFetchingData(false);
                    }, () => {
                        // Error or permission denied
                        setOrderData(null);
                        setFetchingData(false);
                    });
                }
            });
        }
    }, [serviceId, orderId]);
    
    const [isServiceOwner, setIsServiceOwner] = useState(null);
    const [isOrderOwner, setIsOrderOwner] = useState(null);

    useEffect(() => {
        if (!loading && servicePublicData && orderData) {
            if (auth) {
                if (servicePublicData && servicePublicData.ownerId === auth.uid) {
                    setIsServiceOwner(true);
                }
                else if (orderData && auth && orderData.userId === auth.uid) {
                    setIsOrderOwner(true);
                }
                else {
                    router.replace('/orders');
                }
            }
            else {
                router.replace('/marketplace');
            }
            console.log(servicePublicData);
            console.log(orderData);
        }
    }, [auth, loading, router, servicePublicData, orderData]);

    const drawerState = useDisclosure();
    const [orderMode, setOrderMode] = useState("status"); // status
    const drawerProps = {isServiceOwner,
        serviceName : servicePublicData ? servicePublicData.name : '',
        serviceType : servicePublicData ? servicePublicData.type : '',
    serviceId, orderId, orderMode, setOrderMode, drawerState};
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

    return (
    <div>
        <Head>
            <title>{servicePublicData ? `Order Details - ${servicePublicData.name}` : (loading ? 'Searching...' :'Order Not Found!')}</title>
            <link rel="icon" href="../public/favicon.ico" />
        </Head>
        <main>
            <Navbar showDrawerIcon={true} drawerContent={<OrderDrawer {...drawerProps} />} drawerState={drawerState} />
            <NavbarSpace />
            {!loading && orderData &&
                <ScaleFade initialScale={0.9} in={true}>
                    <Flex direction="column" align="center" justify="center">
                        <Flex p={4} w="100%" align="start" justify="space-between">
                            {breakpoint!=="base" && <OrderDrawer {...drawerProps} />}
                            <AnimatePresence exitBeforeEnter>
                                {orderMode === "status" && <OrderStatus key="status" {...{auth, isServiceOwner, serviceId, orderId, servicePublicData, orderData}} />}
                            </AnimatePresence>
                        </Flex>
                    </Flex>
                </ScaleFade>
            }
            {!loading && !fetchingData && !orderData &&
                <NotFound text="Order not found! 😢"/>
            }
            {(loading || fetchingData) &&
                <Searching />
            }
        </main>
        <footer>

        </footer>
    </div>
    )
}