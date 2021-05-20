import { useBreakpointValue, VStack, Box, Avatar, AvatarBadge, Text } from '@chakra-ui/react';
import TextTransition, { presets } from "react-text-transition";

export default function NavbarProfile({username, email, src, ...props}) {
    const breakpoint = useBreakpointValue({ base: "base", md: "md" });

    return (
        <VStack {...props} cursor="pointer" _hover={{ fontWeight: 'semibold' }}
    _groupHover={{ color: 'tomato' }} py={2}>
            <Avatar src={src}>
                {email && <AvatarBadge boxSize="1.25em" bg="green.500" />}
            </Avatar>

        </VStack>
    )
}
/*
            {breakpoint!=="base" &&
                <Box ml="3">
                    <Text as="span" fontWeight="bold"><TextTransition text={username} springConfig={ presets.gentle } /></Text>
                    <Text as="span" fontSize="sm"><TextTransition text={email} springConfig={ presets.gentle } /></Text>
                </Box>
            }
            */