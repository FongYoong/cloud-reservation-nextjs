import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AnimateSharedLayout } from "framer-motion";
import { getPublicServices } from '../../lib/db';
import { ScaleFade, Flex } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import ServiceCard from '../../components/marketplace/ServiceCard';
import Searching from '../../components/Searching';
import NotFound from '../../components/NotFound';

export default function Marketplace() {
  const router = useRouter();
  const [fetchingServices, setFetchingServices] = useState(true);
  const [services, setServices] = useState([]);
  const [somethingHovered, setSomethingHovered] = useState(false);
  const [somethingClicked, setSomethingClicked] = useState(false);
  const [targetCardKey, setTargetCardKey] = useState(null);
  
  useEffect(() => {
    getPublicServices(true, (data) => {
        if (data) {
          const array = Object.keys(data).map((key) => ({
            serviceId: key, ...data[key]
          }));
          array.reverse();
          setServices(array);
        }
        setFetchingServices(false);
    });
  }, []);

  //const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

  return (
    <div>
      <Head>
        <title>Marketplace</title>
        <link rel="icon" href="../public/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <NavbarSpace />
        <ScaleFade initialScale={0.9} in={true}>
          <Flex p={2} w="100%" direction="column" align="center" justify="center">
              <Flex w="100%" flexWrap='wrap' align="start" justify="center">
                <AnimateSharedLayout>
                {services && services.map((data) => (
                  <ServiceCard blur={somethingHovered && targetCardKey !== data.serviceId} hide={somethingClicked && targetCardKey !== data.serviceId} m={4} key={data.serviceId} shallowData={data}
                    onClick={() => {
                      setTargetCardKey(data.serviceId);
                      setSomethingClicked(true);
                      setTimeout(() => router.push(`/services/${data.serviceId}`), 400);
                    }}
                    onMouseEnter={ () => {
                        setTargetCardKey(data.serviceId);
                        setSomethingHovered(true);
                    }}
                    onMouseLeave={ () => {
                        setSomethingHovered(false);
                    }}
                  />
                ))
                }
                </AnimateSharedLayout>
              </Flex>
          </Flex>
        </ScaleFade>
        {!fetchingServices && !services &&
          <NotFound text="Failed to obtain profile! 😢"/>
        }
        {fetchingServices &&
          <Searching />
        }
      </main>
      <footer>

      </footer>
    </div>
  )
}