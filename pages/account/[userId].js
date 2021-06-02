import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getUserProfile } from '../../lib/db';
import { ScaleFade, Flex } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import ProfileOverview from '../../components/account/ProfileOverview';
import Searching from '../../components/Searching';
import NotFound from '../../components/NotFound';

export default function Profile() {
    const { auth, loading } = useAuth();
    const router = useRouter();
    const userId = router.query.userId;
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
    if (!loading) {
        if (auth) {
            if (userId === auth.uid) {
                router.replace('/account');
            }
            else {
                getUserProfile(true, userId, (result) => {
                    setFetchingProfile(false);
                    setProfileData(result)
                });
            }
        }
        else {
            router.replace('/login');
        }
    }
    }, [auth, loading, router, userId]);

    return (
    <div>
        <Head>
        <title>Profile</title>
        <link rel="icon" href="../public/favicon.ico" />
        </Head>
        <main>
        <Navbar />
        <NavbarSpace />
        {!loading && userId !== auth.uid && profileData &&
        <ScaleFade initialScale={0.9} in={true}>
            <Flex p={4} w="100%" direction="column" align="center" justify="center">
                <ProfileOverview key="overview" {...{uid: userId, profileData, auth}} />
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
