import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { AnimatePresence } from "framer-motion";
import { Slide } from "react-awesome-reveal";
import { getUserOrders } from '../../lib/db';
import { useBreakpointValue, ScaleFade, Flex } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import OrderCard from '../../components/service/OrderCard';
import Searching from '../../components/Searching';
import Empty from '../../components/Empty';

export default function Payments() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [ordersList, setOrdersList] = useState(null);
  const [targetCardKey, setTargetCardKey] = useState(null);

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
              })).filter((order) => {
                return order.status === 'accepted' || order.status === 'paidByUser'
              });
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

  // accepted(pending payment), paidByUser(already paid so it's a past purchase)

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
          <Flex p={2} w="100%" direction="column" align="start" justify="center" >
            {ordersList && ordersList.length > 0 &&
              <Slide cascade duration={500} direction='right' triggerOnce >
                  {ordersList.map((data, i) => (
                      <OrderCard isAllOrdersPage={true} mb={4} key={i} order={data} hide={targetCardKey === i}
                      onClick={() => {
                          setTargetCardKey(i);
                          router.push(`/orders/${data.serviceId}/${data.orderId}`);
                      }}
                      />
                  ))
                  }
              </Slide>
            }
          </Flex>
        </ScaleFade>
        {!fetchingOrders && (!ordersList || ordersList.length == 0) &&
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
