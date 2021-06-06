import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getUserServices } from '../../lib/db';
import { AnimatePresence } from "framer-motion";
import { useBreakpointValue, useDisclosure, ScaleFade, Flex, Box } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import Loading from '../../components/Loading';
import ServicesDrawer from '../../components/drawers/ServicesDrawer';
import ServicesOverview from '../../components/services/ServicesOverview';
//import AddService from '../../components/services/AddService';
const AddService = dynamic(() => import('../../components/services/AddService'),
  { loading: Loading }
);
//import AllServices from '../../components/services/AllServices';
const AllServices = dynamic(() => import('../../components/services/AllServices'),
  { loading: Loading }
);


export default function Services() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  const [fetchingServices, setFetchingServices] = useState(true);
  const [servicesList, setServicesList] = useState(null);

  useEffect(() => {
      if (router.query && Object.keys(router.query).length === 1) {
          setServiceMode(Object.keys(router.query)[0]);
      }
  }, [router.query]);

  useEffect(() => {
    if (!loading) {
      if (!auth) {
          router.replace('/login');
      }
      else {
        getUserServices(true, auth.uid, (data) => {
          if (data) {
              const array = Object.keys(data).map((key) => ({
                serviceId: key, ...data[key]
              }));
              array.reverse();
              setServicesList(array);
          }
          else {
              setServicesList(null);
          }
          setFetchingServices(false);
        });
      }
    }
  }, [auth, loading, router]);

  const drawerState = useDisclosure();
  const [serviceMode, setServiceMode] = useState("overview"); // add, overview, all,
  const drawerProps = {serviceMode, setServiceMode, drawerState};
  const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

  return (
    <div>
      <Head>
        <title>Services</title>
      </Head>
      <main>
        <Navbar showDrawerIcon={true} drawerContent={<ServicesDrawer {...drawerProps} />} drawerState={drawerState} />
        <NavbarSpace />
        <ScaleFade initialScale={0.9} in={true}>
          <Flex direction="column" align="center" justify="center">
            <Flex p={4} w="100%" align="start" justify="space-between">
              {breakpoint!=="base" && <ServicesDrawer {...drawerProps} />}
              <Box flex={5} minWidth={0} >
                <AnimatePresence exitBeforeEnter>
                    {serviceMode === "add" && <AddService key="add" auth={auth} />}
                    {serviceMode === "overview" && <ServicesOverview fetchingServices={fetchingServices} servicesList={servicesList} key="overview" auth={auth} />}
                    {serviceMode === "all" && <AllServices fetchingServices={fetchingServices} servicesList={servicesList} key="all" auth={auth} />}
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
