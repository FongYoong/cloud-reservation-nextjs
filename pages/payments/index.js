import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { AnimatePresence } from "framer-motion";
import { Flip } from "react-awesome-reveal";
import { getUserOrders } from '../../lib/db';
import { useBreakpointValue, ScaleFade, Flex } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import Searching from '../../components/Searching';
import Empty from '../../components/Empty';

export default function Payments() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [ordersList, setOrdersList] = useState(null);

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

  const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

  return (
    <div>
      <Head>
        <title>Payments</title>
        <link rel="icon" href="../../public/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <NavbarSpace />
        <ScaleFade initialScale={0.9} in={true}>
          <Flex p={2} w="100%" direction="column" align="center" justify="center">
              <Flex w="100%" flexWrap='wrap' align="start" justify="start">
                <Flip cascade duration={400} direction='vertical' triggerOnce >

                </Flip>
              </Flex>
          </Flex>
        </ScaleFade>
        {!fetchingOrders && !ordersList &&
           <Empty />
        }
        {(fetchingOrders) &&
          <Searching />
        }
      </main>
      <footer>

      </footer>
    </div>
  )
}
