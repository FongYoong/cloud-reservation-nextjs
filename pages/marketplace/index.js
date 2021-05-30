import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import { getServices } from '../../lib/db';
import { ScaleFade, useBreakpointValue, useColorModeValue, Flex, Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import ServiceCard from '../../components/marketplace/ServiceCard';
import { FcGoogle } from 'react-icons/fc';

export default function Marketplace() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [somethingHovered, setSomethingHovered] = useState(false);
  const [somethingClicked, setSomethingClicked] = useState(false);
  const [targetCardKey, setTargetCardKey] = useState(null);
  
  useEffect(() => {
    getServices((data) => {
        if (data) {
          const array = Object.keys(data).map((key) => ({
            serviceId: key, ...data[key]
          }));
          array.reverse();
          setServices(array);
        }
    });
  }, []);


  const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

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
              {services && services.map((data, i) => (
                <ServiceCard blur={somethingHovered && targetCardKey !== i} hide={somethingClicked && targetCardKey !== i}  m={4} key={i} shallowData={data}
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
              </Flex>
          </Flex>
        </ScaleFade>
      </main>
      <footer>

      </footer>
    </div>
  )
}