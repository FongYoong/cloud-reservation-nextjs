import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getUserProfile } from '../../lib/db';
import { AnimatePresence } from "framer-motion";
import { ScaleFade, useBreakpointValue, useDisclosure, Flex, Box } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import Loading from '../../components/Loading';
import AccountDrawer from '../../components/drawers/AccountDrawer';
//import EditProfile from '../../components/account/EditProfile';
const EditProfile = dynamic(() => import('../../components/account/EditProfile'),
  { loading: Loading }
);
import ProfileOverview from '../../components/account/ProfileOverview';
import Searching from '../../components/Searching';
const NotFound = dynamic(() => import('../../components/NotFound'),
  { loading: Loading }
);

export default function Account() {
  const { auth, loading } = useAuth();
  const router = useRouter();
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
      if (router.query && Object.keys(router.query).length === 1) {
          setMode(Object.keys(router.query)[0]);
      }
  }, [router.query]);

  useEffect(() => {
    if (!loading) {
        if (auth) {
          getUserProfile(true, auth.uid, (result) => {
            setFetchingProfile(false);
            setProfileData(result);
          });
        }
        else {
          router.replace('/login');
        }
    }
  }, [auth, loading, router]);
  const drawerState = useDisclosure();
  const [mode, setMode] = useState("overview"); // edit, overview
  const drawerProps = { mode, setMode, drawerState };
  const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

  return (
    <div>
      <Head>
        <title>Account</title>
      </Head>
      <main>
        <Navbar showDrawerIcon={true} drawerContent={<AccountDrawer {...drawerProps} />} drawerState={drawerState} />
        <NavbarSpace />
        {!loading && profileData &&
          <ScaleFade initialScale={0.9} in={true}>
            <Flex direction="column" align="center" justify="center">
              <Flex p={4} w="100%" align="start" justify="space-between">
                  {breakpoint!=="base" && <AccountDrawer {...drawerProps} />}
                  <Box flex={5} minWidth={0} >
                    <AnimatePresence exitBeforeEnter>
                        {mode === "edit" && <EditProfile key="edit" {...{profileData, auth}} />}
                        {mode === "overview" && <ProfileOverview key="overview" {...{uid: auth.uid, profileData, auth, sameUser:true}} />}
                    </AnimatePresence>
                  </Box>
              </Flex>
            </Flex>
          </ScaleFade>
        }
        {!loading && !fetchingProfile && !profileData &&
          <NotFound text="Failed to obtain profile! 😢"/>
        }
        {(loading || fetchingProfile) &&
          <Searching />
        }
      </main>
      <footer>

      </footer>
    </div>
  )
}
