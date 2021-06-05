import { memo, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { getUserProfile, listenUserChats } from '../lib/db';
import NavbarButton from './NavbarButton';
import { Link as CLink, useToast, useColorMode, useColorModeValue, LinkBox, LinkOverlay, VStack, Text, Avatar, AvatarBadge, Spacer, HStack, Button, IconButton, Flex, Heading,
useBreakpointValue,
AlertDialog,
AlertDialogBody,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogContent,
AlertDialogOverlay,
Drawer,
DrawerOverlay,
DrawerContent,
DrawerHeader,
Menu,
MenuButton,
MenuList,
MenuItem,
MenuGroup,
MenuDivider,
} from '@chakra-ui/react';
import { motion } from "framer-motion";
import { MotionButton } from "./MotionElements";
import { BsSun, BsMoon } from 'react-icons/bs';
import { MdLocalGroceryStore, MdHome, MdWork, MdAttachMoney, MdHelp } from 'react-icons/md';
import { RiChatSmile3Line, RiUserLine } from 'react-icons/ri';
import { HiMenu } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import { IoReturnUpBack, IoStorefront } from 'react-icons/io5';
// Sound Effects
import UIfx from 'uifx';
import popMP3 from '../public/sounds/pop.mp3';

const Navbar = ({hideOnScroll=true, showDrawerIcon, drawerContent, drawerState }) => {
    const { auth, loading, signOut } = useAuth();
    const router = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue("gray.100", "gray.600");
    const toast = useToast();
    const toastId = "messageToast";
    const [newMessage, setNewMessage] = useState(false);
    const popSound = useRef(null);
    useEffect(() => {
        popSound.current = new UIfx(popMP3);
    }, []);

    useEffect(() => {
        if (!loading && auth && router.pathname !== '/chats') {
            listenUserChats(auth, () => {
                if (router.pathname !== '/chats' && !toast.isActive(toastId)) {
                    console.log(router.pathname);
                    setNewMessage(true);
                    if (popSound.current) {
                        popSound.current.play();
                    }
                    toast({
                        id: toastId,
                        status: "info",
                        duration: 5000,
                        position: 'bottom-right',
                        isClosable: true,
                        // eslint-disable-next-line react/display-name
                        render: () => (
                            <VStack spacing={4} p={3} backdropFilter='blur(10px)' bgGradient="linear(to-l, #551b8f, #c90065)" borderWidth={2} borderRadius="lg" boxShadow="lg" >
                                <Text color='white' >
                                    <span role='img' aria-label='Message' >💬 </span> Someone messaged you!
                                </Text>
                                <MotionButton getAttention={true} colorScheme={"yellow"}
                                onClick={() => {
                                    toast.closeAll();
                                    router.push('/chats');
                                }} icon={<RiChatSmile3Line />} >
                                    Chats
                                </MotionButton>
                            </VStack>
                        )
                    });
                }
            }, () => {
                alert('Firebase chat error!')
            });
        }
    }, [auth, loading, router]);

    // Drawer for small screens
    // Logout
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const onLogoutClose = () => setIsLogoutOpen(false);
    const cancelRef = useRef();
    // Profile
    const [profile, setProfile] = useState({username:'', email:'', profile_picture:''});
    // For scrolling
    const [previousScrollPos, setPreviousScrollPos] = useState(0);
    const [topOffset, setTopOffset] = useState('0');
    useEffect(() => {
        if (auth) {
            getUserProfile(true, auth.uid, (result) => {setProfile(result)});
        }
    }, [auth]);
    useEffect(() => {
        if (hideOnScroll) {
            window.onscroll = () => {
                const currentScrollPos = window.pageYOffset;
                if (previousScrollPos > currentScrollPos) {
                    setTopOffset('0');
                } else {
                    setTopOffset(breakpoint==="base" ? '-4em':'-5em');
                }
                setPreviousScrollPos(currentScrollPos);
            }
        }
    });

    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

    return (
        <>
            <Flex transition='top 1s' zIndex={1000} bg={bg} position="fixed" w="100%" top={topOffset} align="center" justify="space-between" p={breakpoint==="base"? "0.4em": "1.5em"}>
                <HStack spacing={4}>
                    {showDrawerIcon && drawerState && breakpoint==="base" && <>
                        <IconButton variant="outline" colorScheme="teal" icon={<HiMenu />} onClick={drawerState.onOpen} />
                        <Drawer zIndex={2000} placement="left" onClose={drawerState.onClose} isOpen={drawerState.isOpen}>
                            <DrawerOverlay />
                            <DrawerContent p={2}>
                                <Flex borderBottomWidth="0.3em">
                                    <IconButton icon={<IoReturnUpBack />} colorScheme="red" onClick={drawerState.onClose} />
                                    <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
                                    <Spacer />
                                </Flex>
                                {drawerContent}
                            </DrawerContent>
                        </Drawer>
                    </>}
                    {!showDrawerIcon && breakpoint==="base" && <IconButton icon={<MdHome size={20} />} onClick={() => router.push('/')}/>}
                    {breakpoint!=="base" &&  <IconButton icon={<MdHome size={40} />} onClick={() => router.push('/')}/>}
                    <Heading fontSize={["sm", "md", "lg", "2xl"]} onClick={() => router.push('/')} as="button">
                        Cloud Reservation
                    </Heading>
                    <IconButton variant="outline" colorScheme="yellow" ml={4} icon={colorMode === "light" ? <BsSun /> : <BsMoon />} onClick={toggleColorMode} />
                    { breakpoint!=="base" &&
                        <NavbarButton path="/marketplace" icon={<IoStorefront />} >
                            Marketplace
                        </NavbarButton>
                    }
                    {auth && breakpoint!=="base" && <>
                        <NavbarButton path="/orders" icon={<MdLocalGroceryStore />} >
                            My Orders
                        </NavbarButton>
                        <NavbarButton path="/services" icon={<MdWork />} >
                            My Services
                        </NavbarButton>
                        <NavbarButton getAttention={newMessage} path="/chats" icon={<RiChatSmile3Line />} >
                            Chats
                        </NavbarButton>
                    </> }
                </HStack>
                <HStack spacing={4}>
                    {auth ? (<>
                        <Menu autoSelect={false} isLazy={true} >
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <MenuButton as={Avatar} cursor="pointer" _hover={{ boxShadow:"outline" }} boxShadow="lg" name={profile.username} src={profile.profile_picture}>
                                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                                </MenuButton>
                            </motion.button>
                            <MenuList>
                                <MenuGroup title="Profile">
                                    <MenuItem icon={<RiUserLine />} onClick={() => router.push('/account')}>
                                        <Link href='/account' >
                                            My Account
                                        </Link>
                                    </MenuItem>
                                    <MenuItem icon={<MdAttachMoney />} onClick={() => router.push('/payments')}>
                                        <Link href='/payments' >
                                            Payments
                                        </Link>
                                    </MenuItem>
                                </MenuGroup>
                                <MenuDivider />
                                <Link href='/marketplace' >
                                    <MenuItem icon={<IoStorefront />} >
                                        Marketplace
                                    </MenuItem>
                                </Link>
                                <Link href='/orders' >
                                    <MenuItem icon={<MdLocalGroceryStore />} >
                                        My Orders
                                    </MenuItem>
                                </Link>
                                <Link href='/services' >
                                    <MenuItem icon={<MdWork />} >
                                        My Services
                                    </MenuItem>
                                </Link>
                                <Link href='/chats' >
                                    <MenuItem icon={<RiChatSmile3Line />} >
                                        Chats
                                    </MenuItem>
                                </Link>
                                <MenuDivider />
                                <Link href='/help' >
                                    <MenuItem icon={<MdHelp />} >
                                        Help
                                    </MenuItem>
                                </Link>
                                <MenuDivider />
                                <MenuItem icon={<FiLogOut />} color="red.500" onClick={() => setIsLogoutOpen(true)}>
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </>) : (
                        <Link href='/login' >
                            <Button p={2} colorScheme="teal" >
                                Login/Register
                            </Button>
                        </Link>
                    )}
                </HStack>
            </Flex>

        <AlertDialog
            isOpen={isLogoutOpen}
            leastDestructiveRef={cancelRef}
            onClose={onLogoutClose}
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                     Logout
                </AlertDialogHeader>
                <AlertDialogBody>
                    Are you sure?
                </AlertDialogBody>
                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onLogoutClose}>
                    No
                </Button>
                <Button colorScheme="red" onClick={() => {
                    signOut();
                    onLogoutClose();
                }} ml={3}>
                    Yes
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    </>
    );
};
const MarketLink = ({ children, ...props }) => {
    return (
        <Link {...props} href='/marketplace' >
            {children}
        </Link>
    )
}

export default memo(Navbar);