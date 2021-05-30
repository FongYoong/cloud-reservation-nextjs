import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { getUserProfile } from '../lib/db';
import { motion } from "framer-motion";
import { Box, Text, MenuButton, Menu, MenuList, MenuItem, Avatar, AvatarBadge } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';

export default function UserAvatar({uid, ...props}) {
    const router = useRouter();
    const menuRef = useRef();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profile, setProfile] = useState({});
    useEffect(() => {
        if (uid) {
            getUserProfile(uid, (result) => {setProfile(result)});
        }
    }, [uid]);

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
            <Menu strategy='fixed' autoSelect={false} isLazy={true} {...props}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MenuButton ref={menuRef} as={Avatar} cursor="pointer" _hover={{ boxShadow:"outline" }} boxShadow="lg" name={profile.username} src={profile.profile_picture} >
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                    </MenuButton>
                </motion.button>
                <MenuList borderWidth={3} boxShadow="lg" bg='purple.50'>
                    <Box px={4} textAlign="left">
                        <Text lineHeight='normal' noOfLines={1} > <b>{profile.username}</b> </Text>
                    </Box>
                    <MenuItem icon={<FaEye />} onClick={() => router.push(`/account/${uid}`)}>View Profile</MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
}