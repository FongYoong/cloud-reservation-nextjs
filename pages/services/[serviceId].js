import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getServicePublicDetails, getServiceReviews, getServiceOrders, deleteService } from '../../lib/db';
import { AnimatePresence } from "framer-motion";
import { useBreakpointValue, useDisclosure, useToast, ScaleFade, Box, Button, Flex,
Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalCloseButton,
ModalBody,
ModalFooter,
CircularProgress
} from "@chakra-ui/react";
import Searching from '../../components/Searching';
//import NotFound from '../../components/NotFound';
const NotFound = dynamic(() => import('../../components/NotFound'));
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import Loading from '../../components/Loading';
import ServiceDrawer from '../../components/drawers/ServiceDrawer';
import ServiceOverview from '../../components/service/ServiceOverview';
//import EditService from '../../components/service/EditService';
const EditService = dynamic(() => import('../../components/service/EditService'),
  { loading: Loading }
);
//import AddOrder from '../../components/service/AddOrder';
const AddOrder = dynamic(() => import('../../components/service/AddOrder'),
  { loading: Loading }
);
//import Reviews from '../../components/service/Reviews';
const Reviews = dynamic(() => import('../../components/service/Reviews'),
  { loading: Loading }
);
//import AllOrders from '../../components/service/AllOrders';
const AllOrders = dynamic(() => import('../../components/service/AllOrders'),
  { loading: Loading }
);

export default function Service () {
    // Only edit if owner of service
    const router = useRouter();
    const { serviceId } = router.query;
    const { auth, loading } = useAuth();
    const [fetchingPublic, setFetchingPublic] = useState(true);
    const [fetchingOrders, setFetchingOrders] = useState(true);
    const [fetchingReviews, setFetchingReviews] = useState(true);
    const [publicData, setPublicData] = useState(null);
    const [ordersList, setOrdersList] = useState(null);
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        if (router.query && Object.keys(router.query).length === 2) {
            setServiceMode(Object.keys(router.query)[0]);
        }
    }, [router.query]);

    useEffect(() => {
        if (serviceId) {
            getServicePublicDetails(serviceId, (data) => {
                setPublicData(data);
                setFetchingPublic(false);
                if (data) {
                    getServiceOrders(true, serviceId, (data) => {
                        if (data) {
                            const array = Object.keys(data).map((key) => ({
                                orderId: key, ...data[key]
                            }));
                            array.reverse();
                            setOrdersList(array);
                        }
                        else {
                            setOrdersList(null);
                        }
                        setFetchingOrders(false);
                    });
                    getServiceReviews(true, serviceId, (data) => {
                        if (data) {
                            const array = Object.keys(data).map((key) => ({
                                ...data[key]
                            }));
                            array.reverse();
                            setReviews(array);
                        }
                        else {
                            setReviews(null);
                        }
                        setFetchingReviews(false);
                    });
                }
                else {
                    setFetchingOrders(false);
                    setFetchingReviews(false);
                }
            });
        }
    }, [serviceId]);

    const toast = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteModalState = useDisclosure();
    const drawerState = useDisclosure();
    const [serviceMode, setServiceMode] = useState("overview"); // edit, addOrder, events, overview, reviews, allOrders
    let isOwner = false;
    if (!loading && publicData && auth && publicData.ownerId === auth.uid) {
        isOwner = true;
    }
    const deleteHandler = () => {
        setIsDeleting(true);
        deleteService(auth, serviceId, () => {
            toast({
                title: `Succesfully deleted service!`,
                description: "Cheers! 😃",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setTimeout(() => router.replace('/services'), 500);
        }, () => {
            // Error
            alert("Firebase Error");
        });
    }
    const drawerProps = {isOwner, serviceId, serviceName: publicData ? publicData.name : 'Unnamed Service',
        serviceType: publicData ? publicData.type : null,
        serviceMode, setServiceMode, drawerState, deleteHandler: ()=>{deleteModalState.onOpen()}};
    const cannotModify = ordersList && ordersList.length > 0;
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

    return (
    <div>
        <Head>
            <title>{publicData ? publicData.name : (loading ? 'Searching...' :'Service Not Found!')}</title>
        </Head>
        <main>
            <Navbar showDrawerIcon={true} drawerContent={<ServiceDrawer {...drawerProps} />} drawerState={drawerState} />
            <NavbarSpace />
            {!loading && publicData &&
                <ScaleFade initialScale={0.9} in={true}>
                    <Flex direction="column" align="center" justify="center">
                        <Flex p={4} w="100%" align="start" justify="space-between">
                            {breakpoint!=="base" && <ServiceDrawer {...drawerProps} />}
                            <Box flex={5} minWidth={0} >
                                <AnimatePresence exitBeforeEnter>
                                    {serviceMode === "edit" && isOwner && <EditService key="edit" {...{cannotModify, serviceId, publicData, auth}} />}
                                    {serviceMode === "addOrder" && !isOwner && <AddOrder key="addOrder" {...{serviceId, serviceData:publicData, auth}} />}
                                    {serviceMode === "overview" && <ServiceOverview key="overview" {...{serviceId, publicData, auth}} />}
                                    {serviceMode === "reviews" && <Reviews key="reviews" {...{fetchingReviews, reviews, auth}} />}
                                    {serviceMode === "allOrders" && isOwner && <AllOrders key="allOrders" {...{fetchingOrders, serviceId, ordersList, auth}} />}
                                </AnimatePresence>
                            </Box>
                        </Flex>
                    </Flex>
                </ScaleFade>
            }
            {!loading && !fetchingPublic && !publicData &&
                <NotFound text="Service not found! 😢"/>
            }
            {(loading || fetchingPublic) &&
                <Searching />
            }
            <Modal motionPreset="scale" closeOnOverlayClick={isDeleting} closeOnEsc={isDeleting} isCentered={true} isOpen={deleteModalState.isOpen} onClose={deleteModalState.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Service?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    {ordersList && ordersList.length > 0 ?
                        "This service already has orders so it cannot be deleted."
                        :"This cannot be undone."
                    }
                    </ModalBody>
                    <ModalFooter>
                        {isDeleting ?
                            <Flex align="center" justify="center">
                                <CircularProgress isIndeterminate color="green.400" />
                            </Flex>
                            :
                            <Button isDisabled={cannotModify} colorScheme="red" mr={3} onClick={deleteHandler}>
                                Delete!
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </main>
        <footer>

        </footer>
    </div>
    )
}