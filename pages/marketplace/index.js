import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { Flip } from "react-awesome-reveal";
import { getPublicServices } from '../../lib/db';
import { ScaleFade, useBreakpointValue, useColorModeValue, Flex, Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import ServiceCard from '../../components/marketplace/ServiceCard';
import Searching from '../../components/Searching';
import NotFound from '../../components/NotFound';

export default function Marketplace() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  const [fetchingServices, setFetchingServices] = useState(true);
  const [services, setServices] = useState([]);
  const [somethingHovered, setSomethingHovered] = useState(false);
  const [somethingClicked, setSomethingClicked] = useState(false);
  const [targetCardKey, setTargetCardKey] = useState(null);
  
  useEffect(() => {
    getPublicServices((data) => {
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
              <Flex w="100%" flexWrap='wrap' align="start" justify="start">
              <Flip cascade duration={400} direction='vertical' triggerOnce >
              {services && services.map((data, i) => (
                <ServiceCard blur={somethingHovered && targetCardKey !== i} hide={somethingClicked && targetCardKey !== i}  m={4} k={i} key={i} shallowData={data}
                  onClick={() => {
                    setTargetCardKey(i);
                    setSomethingClicked(true);
                    setTimeout(() => router.push(`/services/${data.serviceId}`), 400);
                  }}
                  onMouseEnter={ () => {
                      setTargetCardKey(i);
                      setSomethingHovered(true);
                  }}
                  onMouseLeave={ () => {
                      setSomethingHovered(false);
                  }}
                />
              ))
              }
              </Flip>
              </Flex>
          </Flex>
        </ScaleFade>
        {!fetchingServices && !services &&
          <NotFound text="Failed to obtain profile! 😢"/>
        }
        {(fetchingServices) &&
          <Searching />
        }
      </main>
      <footer>

      </footer>
    </div>
  )
}