import { memo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MotionButton } from './MotionElements';
import { LinkBox, LinkOverlay } from '@chakra-ui/react';

export default memo(function NavbarButton({children, getAttention=false, icon, path, ...props}) {
    const router = useRouter();
    return (
        <LinkBox>
            <MotionButton getAttention={getAttention} icon={icon} colorScheme={router.pathname === path ? "pink":"teal"} {...props} >
                <Link href={path} passHref >
                    <LinkOverlay>
                        {children}
                    </LinkOverlay>
                </Link>
            </MotionButton>
        </LinkBox>
    )
});
/*
<MenuList>
  <NextLink href="/settings" passHref>
    <MenuItem as={Link}>Settings</MenuItem>
  </NextLink>
</MenuList>
*/