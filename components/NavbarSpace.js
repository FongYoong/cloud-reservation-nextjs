import { memo } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';

export default memo(function NavbarSpace() {
    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });
    return (
        <Box mt={`${breakpoint==="base"? 3.8: 5.5}em`} />
    )
});