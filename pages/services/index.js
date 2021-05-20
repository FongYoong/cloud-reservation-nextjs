import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from "framer-motion";
import { useBreakpointValue, useDisclosure, ScaleFade, Container, Heading, Spacer, Link, Box, Button, ButtonGroup, VStack, Flex } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import ServicesDrawer from '../../components/drawers/ServicesDrawer';
import AddService from '../../components/services/AddService';
import ServiceOverview from '../../components/services/ServiceOverview';
import AllServices from '../../components/services/AllServices';
import { useAuth } from '../../lib/auth';

export default function Services() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !auth) {
        router.replace('/login');
    }
  }, [auth, loading, router]);
  const drawerState = useDisclosure();
  const [serviceMode, setServiceMode] = useState("add"); // add, overview, all,
  const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

  const drawerProps = {serviceMode, setServiceMode, drawerState};

  return (
    <div>
      <Head>
        <title>Services</title>
        <link rel="icon" href="../public/favicon.ico" />
      </Head>
      <main>
        <Navbar showDrawerIcon={true} drawerContent={<ServicesDrawer {...drawerProps} />} drawerState={drawerState} />
        <NavbarSpace />
        <ScaleFade initialScale={0.9} in={true}>
          <Flex direction="column" align="center" justify="center">
            <Flex p={4} w="100%" align="start" justify="space-between">
              {breakpoint!=="base" && <ServicesDrawer {...drawerProps} />}
              <Box flex={5}>
                <AnimatePresence exitBeforeEnter>
                    {serviceMode === "add" && <AddService key="add" />}
                    {serviceMode === "overview" && <ServiceOverview key="overview" />}
                    {serviceMode === "all" && <AllServices key="all" />}
                </AnimatePresence>
              </Box>
            </Flex>
          </Flex>
        </ScaleFade>
      </main>
      <footer>

      </footer>
    </div>
  )
}
