import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { getUserProfile } from '../lib/db';
import NavbarButton from './NavbarButton';
import { useColorMode, useColorModeValue, Skeleton, SkeletonText, Avatar, AvatarBadge, Spacer, HStack, Button, IconButton, Flex, Heading,
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
import { BsSun, BsMoon } from 'react-icons/bs';
import { MdLocalGroceryStore, MdHome, MdWork, MdAttachMoney, MdHelp } from 'react-icons/md';
import { RiChatSmile3Line, RiUserLine } from 'react-icons/ri';
import { HiMenu } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import { IoReturnUpBack, IoStorefront } from 'react-icons/io5';

const Navbar = ({showDrawerIcon, drawerContent, drawerState}) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue("gray.100", "gray.600")
    const { auth, loading, signOut } = useAuth();
    const router = useRouter();
    // Drawer for small screens
    //const drawerState = useDisclosure();
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
            getUserProfile(auth, (result) => {setProfile(result)});
        }
    }, [auth]);
    useEffect(() => {
        window.onscroll = () => {
            const currentScrollPos = window.pageYOffset;
            if (previousScrollPos > currentScrollPos) {
                setTopOffset('0');
            } else {
                setTopOffset('-4em');
            }
            setPreviousScrollPos(currentScrollPos);
        }
    });

    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });
    // const variant = useBreakpointValue({ base: "outline", md: "solid" })
    // { base: "gray.100", md: "gray.100", lg: "gray.100" }
    // {breakpoint!=="base" &&  <FcWorkflow size={70} />}
    return (
        <>
        <Skeleton isLoaded={!loading}>
            <Flex transition='top 0.3s' zIndex={1000} bg={bg} position="fixed" w="100%" top={topOffset} align="center" justify="space-between" p={breakpoint==="base"? "0.4em": "1.5em"}>
                <HStack spacing={4}>
                    {showDrawerIcon && drawerState && auth && breakpoint==="base" && <>
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
                    {auth && breakpoint!=="base" && <>
                        <NavbarButton path="/marketplace" icon={<IoStorefront />} >
                            Marketplace
                        </NavbarButton>
                        <NavbarButton path="/purchases" icon={<MdLocalGroceryStore />} >
                            My Purchases
                        </NavbarButton>
                        <NavbarButton path="/services" icon={<MdWork />} >
                            My Services
                        </NavbarButton>
                        <NavbarButton path="/chats" icon={<RiChatSmile3Line />} >
                            Chats
                        </NavbarButton>
                    </> }
                </HStack>
                <HStack spacing={4}>
                    {auth ? (<>
                        <Menu autoSelect={false}>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <MenuButton as={Avatar} cursor="pointer" _hover={{ boxShadow:"outline" }} boxShadow="lg" name={profile.username} email={profile.email} src={profile.profile_picture}>
                                    {profile.email && <AvatarBadge boxSize="1.25em" bg="green.500" />}
                                </MenuButton>
                            </motion.button>
                            <MenuList>
                                <MenuGroup title="Profile">
                                    <MenuItem icon={<RiUserLine />} onClick={() => router.push('/account')}>My Account</MenuItem>
                                    <MenuItem icon={<MdAttachMoney />} onClick={() => router.push('/payments')}>Payments</MenuItem>
                                </MenuGroup>
                                <MenuDivider />
                                <MenuItem icon={<IoStorefront />} onClick={() => router.push('/marketplace')}>Marketplace</MenuItem>
                                <MenuItem icon={<MdLocalGroceryStore />} onClick={() => router.push('/purchases')}>Purchases</MenuItem>
                                <MenuItem icon={<MdWork />} onClick={() => router.push('/services')}>Services</MenuItem>
                                <MenuItem icon={<RiChatSmile3Line />} onClick={() => router.push('/chats')}>Chats</MenuItem>
                                <MenuDivider />
                                <MenuItem icon={<MdHelp />} onClick={() => router.push('/help')}>Help</MenuItem>
                                <MenuDivider />
                                <MenuItem icon={<FiLogOut />} color="red.500" onClick={() => setIsLogoutOpen(true)}>
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </>) : (
                        <Button p={2} colorScheme="teal" onClick={() => router.push('/login')} >
                            Login/Register
                        </Button>
                    )}
                </HStack>
            </Flex>
        </Skeleton>

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

// fontWeight={ router.pathname === '/login' ? 'extrabold' : 'normal'}

/*
{breakpoint!=="base" && <>
    <Button leftIcon={<IoIosAddCircleOutline />} colorScheme="teal" onClick={() => router.push('/services/new')}>
        Add service
    </Button>
</> }
*/

export default Navbar;