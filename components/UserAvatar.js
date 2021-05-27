import { useRef } from 'react';
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { Box, Text, MenuButton, Menu, MenuList, MenuItem, Avatar, AvatarBadge } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';

export default function UserAvatar({name, src, ...props}) {
    const router = useRouter();
    const menuRef = useRef();

    return (
        <div onMouseEnter={() => { menuRef.current.click() }} onMouseLeave={() => { menuRef.current.click() }} >
            <Menu autoSelect={false} {...props}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <MenuButton ref={menuRef} as={Avatar} cursor="pointer" _hover={{ boxShadow:"outline" }} boxShadow="lg" name={name} src={src} >
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                    </MenuButton>
                </motion.button>
                <MenuList>
                    <Box px={4} textAlign="left">
                        <Text as='b'> {name} </Text>
                    </Box>
                    <MenuItem icon={<FaEye />} onClick={() => router.push('/marketplace')}>View Profile</MenuItem>
                </MenuList>
            </Menu>
        </div>
    );
}