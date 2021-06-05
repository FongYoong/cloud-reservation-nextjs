import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getUserOrders } from '../../lib/db';
import { AnimatePresence } from "framer-motion";
import { useBreakpointValue, useDisclosure, ScaleFade, Flex } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import OrdersDrawer from '../../components/drawers/OrdersDrawer';
import OrdersOverview from '../../components/orders/OrdersOverview';
import AllOrders from '../../components/orders/AllOrders';

export default function Orders() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [ordersList, setOrdersList] = useState(null);

  useEffect(() => {
      if (router.query && Object.keys(router.query).length === 1) {
          setOrderMode(Object.keys(router.query)[0]);
      }
  }, [router.query]);

  useEffect(() => {
    if (!loading) {
      if (!auth) {
          router.replace('/login');
      }
      else {
        getUserOrders(true, auth, (data) => {
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
      }
    }
  }, [auth, loading, router]);

  const drawerState = useDisclosure();
  const [orderMode, setOrderMode] = useState('all'); // overview, all
  const drawerProps = {orderMode, setOrderMode, drawerState};
  const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

  return (
    <div>
      <Head>
        <title>Orders</title>
        <link rel="icon" href="../../public/favicon.ico" />
      </Head>
      <main>
        <Navbar showDrawerIcon={true} drawerContent={<OrdersDrawer {...drawerProps} />} drawerState={drawerState} />
        <NavbarSpace />
        <ScaleFade initialScale={0.9} in={true}>
          <Flex direction="column" align="center" justify="center">
            <Flex p={4} w="100%" align="start" justify="space-between">
              {breakpoint!=="base" && <OrdersDrawer {...drawerProps} />}
              <AnimatePresence exitBeforeEnter>
                  {orderMode === "overview" && <OrdersOverview fetchingOrders={fetchingOrders} ordersList={ordersList} key="overview" auth={auth} />}
                  {orderMode === "all" && <AllOrders fetchingOrders={fetchingOrders} ordersList={ordersList} key="all" auth={auth} />}
              </AnimatePresence>
            </Flex>
          </Flex>
        </ScaleFade>
      </main>
      <footer>

      </footer>
    </div>
  )
}
