import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { Flip } from "react-awesome-reveal";
import { getUserChats, sendMessage, deleteChatListeners } from '../../lib/db';
import { AnimatePresence } from "framer-motion";
import { ScaleFade, useBreakpointValue, useDisclosure, Flex,Text } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import ChatsDrawer from '../../components/drawers/ChatsDrawer';
import Chat from '../../components/chats/Chat';
import Searching from '../../components/Searching';
import Empty from '../../components/Empty';
// Sound Effects
import UIfx from 'uifx';
import popMP3 from '../../public/sounds/pop.mp3';

export default function Chats() {
    const { auth, loading } = useAuth();
    const router = useRouter();

    const [currentChatIndex, setCurrentChatIndex] = useState(0); // 0, 1, 2 ...
    const [fetchingChats, setFetchingChats] = useState(true);
    const [chats, setChats] = useState(null);
    const [hasInitialised, setHasInitialised] = useState(false);
    const [hasScrolledBefore, setHasScrolledBefore] = useState(false);
    const popSound = useRef(null);
    useEffect(() => {
        popSound.current = new UIfx(popMP3);
    }, []);
  
    const transformMessages = (messages) => {
      const array = Object.keys(messages).map((key) => ({
          ...messages[key],
      }));
      return array;
    }

    useEffect(() => {
    if (!loading) {
        if (auth) {
          deleteChatListeners(auth);
          getUserChats(true, auth, (result) => {
            let array = null;
            if (result) {
              array = Object.keys(result).map((key) => ({
                otherId: key, ...result[key]
              }));
              array.sort((a, b) => {
                return b.lastMessaged - a.lastMessaged;
              });
            }
            // check for query
            if (!hasInitialised && router.query && Object.keys(router.query).length === 1) {
              if (!array) {
                array = [];
              }
              const otherId = Object.keys(router.query)[0];
              let alreadyExisted = false;
              if (result) {
                for (const i in array) {
                  if (array[i].otherId === otherId) {
                    setCurrentChatIndex(i);
                    alreadyExisted = true;
                    break;
                  }
                }
              }
              if (!alreadyExisted) {
                array.unshift({
                  otherId
                });
              }
            }
            else {
              setCurrentChatIndex(0);
            }
            if (array) {
              array = array.map((chatData) => {
                if (chatData.messages) {
                  return {
                    ...chatData,
                    messages: transformMessages(chatData.messages),
                  }
                }
                else {
                  return chatData;
                }
              });
            }
            setHasInitialised(true);
            setChats(array);
            setFetchingChats(false);
          }, (e) => {
            alert('Firebase error!');
            console.log(e);
          });
        }
        else {
            router.replace('/login');
        }
    }
    }, [auth, loading, router]);

    const sendMessageHandler = (otherId, message) => {
      sendMessage(auth, otherId, message,
      () => {
        if (popSound.current) {
          popSound.current.play();
        }
      },
      () => {
          alert("Firebase Error");
      });
    }
    const drawerState = useDisclosure();
    useEffect(() => {
      setHasScrolledBefore(false);
    }, [currentChatIndex]);
    const drawerProps = { fetchingChats, chats, currentChatIndex, setCurrentChatIndex, drawerState };
    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });

    return (
    <div>
        <Head>
        <title>Chats</title>
        <link rel="icon" href="../public/favicon.ico" />
        </Head>
        <main>
          <Navbar hideOnScroll={false} showDrawerIcon={true} drawerContent={<ChatsDrawer {...drawerProps} />} drawerState={drawerState} />
          <NavbarSpace />
          {!loading && chats &&
            <ScaleFade initialScale={0.9} in={true}>
                <Flex direction="column" align="center" justify="center">
                  <Flex p={4} w="100%" align="start" justify="space-between">
                      {breakpoint!=="base" && <ChatsDrawer {...drawerProps} />}
                      <AnimatePresence exitBeforeEnter>
                          <Chat key={chats[currentChatIndex].otherId} chatData={chats[currentChatIndex]} sendMessageHandler={sendMessageHandler}
                            hasScrolledBefore={hasScrolledBefore} setHasScrolledBefore={setHasScrolledBefore}
                          />
                      </AnimatePresence>
                  </Flex>
                </Flex>
            </ScaleFade>
          }
          {!loading && !fetchingChats && !chats &&
            <Empty>
              <Text fontSize='lg' > Chat with a seller or potential client by finding their profile from the marketplace. </Text>
            </Empty>
          }
          {(loading || fetchingChats) &&
            <Searching />
          }
        </main>
        <footer>

        </footer>
    </div>
    )
}
