import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getServicePublicDetails, deleteService } from '../../lib/db';
import { AnimatePresence } from "framer-motion";
import { useBreakpointValue, useDisclosure, useToast, ScaleFade, Heading, Box, Button, VStack, Flex,
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
import NotFound from '../../components/NotFound';
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import ServiceDrawer from '../../components/drawers/ServiceDrawer';
import EditService from '../../components/service/EditService';
import AddOrder from '../../components/service/AddOrder';
import ServiceOverview from '../../components/service/ServiceOverview';
import AllOrders from '../../components/service/AllOrders';

export default function Service () {
    // Only edit if owner of service
    const router = useRouter();
    const { serviceId } = router.query;
    const { auth, loading } = useAuth();
    const [fetchingData, setFetchingData] = useState(true);
    const [publicData, setPublicData] = useState(null);
    useEffect(() => {
        if (serviceId) {
            getServicePublicDetails(serviceId, (data) => {
                console.log(data);
                setPublicData(data);
                setFetchingData(false);
            });
        }
    }, [serviceId]);

    const toast = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteModalState = useDisclosure();
    const drawerState = useDisclosure();
    const [serviceMode, setServiceMode] = useState("overview"); // edit, addOrder, overview, allOrders
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
    const drawerProps = {isOwner, serviceName: publicData ? publicData.name : 'Unnamed Service', serviceMode, setServiceMode, drawerState, deleteHandler: ()=>{deleteModalState.onOpen()}};
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

    return (
    <div>
        <Head>
            <title>{publicData ? publicData.name : (loading ? 'Searching...' :'Service Not Found!')}</title>
            <link rel="icon" href="../public/favicon.ico" />
        </Head>
        <main>
            <Navbar showDrawerIcon={true} drawerContent={<ServiceDrawer {...drawerProps} />} drawerState={drawerState} />
            <NavbarSpace />
            {!loading && publicData &&
                <ScaleFade initialScale={0.9} in={true}>
                    <Flex direction="column" align="center" justify="center">
                        <Flex p={4} w="100%" align="start" justify="space-between">
                            {breakpoint!=="base" && <ServiceDrawer {...drawerProps} />}
                            <AnimatePresence exitBeforeEnter>
                                {serviceMode === "edit" && isOwner && <EditService key="edit" {...{serviceId, publicData, auth}} />}
                                {serviceMode === "addOrder" && !isOwner && <AddOrder key="addOrder" {...{serviceId, serviceData: publicData, auth}} />}
                                {serviceMode === "overview" && <ServiceOverview key="overview" {...{serviceId, publicData, auth}} />}
                                {serviceMode === "allOrders" && isOwner && <AllOrders key="allOrders" {...{serviceId, auth}} />}
                            </AnimatePresence>
                        </Flex>
                    </Flex>
                </ScaleFade>
            }
            {!loading && !fetchingData && !publicData &&
                <NotFound text="Service not found! 😢"/>
            }
            {(loading || fetchingData) &&
                <Searching />
            }
            <Modal motionPreset="scale" closeOnOverlayClick={isDeleting} closeOnEsc={isDeleting} isCentered={true} isOpen={deleteModalState.isOpen} onClose={deleteModalState.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Service?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        This cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        {isDeleting ?
                            <Flex align="center" justify="center">
                                <CircularProgress isIndeterminate color="green.400" />
                            </Flex>
                            :
                            <Button colorScheme="red" mr={3} onClick={deleteHandler}>
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