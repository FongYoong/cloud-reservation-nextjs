import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import { getUserProfile } from '../lib/db';
import { motion } from "framer-motion";
import { Portal, useColorModeValue, Box, Text, MenuButton, Menu, MenuList, MenuItem, Avatar, AvatarBadge } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import { RiChatSmile3Line } from 'react-icons/ri';

export default function UserAvatar({ customProfile=null, uid, ...props }) {
    const { auth, loading } = useAuth();
    const router = useRouter();
    const menuRef = useRef();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profile, setProfile] = useState(customProfile ? customProfile : {});
    useEffect(() => {
        if (!customProfile && uid) {
            getUserProfile(true, uid, (result) => {setProfile(result)});
        }
        else {
            setProfile(customProfile);
        }
    }, [customProfile, uid]);

    const click = (isLeave=false) => {
        if (isLeave && !menuOpen) {
            return;
        }
        menuRef.current.click();
        setMenuOpen(!menuOpen);
    }

    return (
        <Box w='4.5em'
        onClick={(e) => {
            e.stopPropagation();
            click(false);
        }} 
        onMouseEnter={() => click(false)}
        onMouseLeave={() => click(true)} >
            <Menu preventOverflow={false} strategy='fixed' autoSelect={false} isLazy={true} {...props}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MenuButton ref={menuRef} as={Avatar} cursor="pointer" _hover={{ boxShadow:"outline" }} boxShadow="lg" name={profile.username} src={profile.profile_picture} >
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                    </MenuButton>
                </motion.button>
                <Portal>
                    <MenuList borderWidth={3} boxShadow="lg" bg={useColorModeValue('green.50', 'green.700')}>
                        <Box px={4} textAlign="left">
                            <Text lineHeight='normal' noOfLines={1} > <b>{profile.username}</b> </Text>
                        </Box>
                        <MenuItem icon={<FaEye />} onClick={() => router.push(`/account/${uid}`)}> View Profile </MenuItem>
                        {router.pathname !== '/chats' && !loading && ( !auth || auth && auth.uid != uid ) &&
                            <MenuItem icon={<RiChatSmile3Line />} onClick={() => 
                                router.push({
                                            pathname: '/chats',
                                            query: { [uid]: '' }
                                        },
                                        undefined, { shallow: true }
                                    )
                                }> Chat </MenuItem>
                        }
                    </MenuList>
                </Portal>
            </Menu>
        </Box>
    );
}