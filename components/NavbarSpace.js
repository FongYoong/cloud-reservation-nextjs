import { Box, useBreakpointValue } from '@chakra-ui/react';

export default function NavbarSpace() {
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });
    return (
        <Box mt={`${breakpoint==="base"? 4: 6.5}em`} />
    )
}