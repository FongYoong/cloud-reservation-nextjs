import { useRouter } from 'next/router';
import { MotionButton } from './MotionElements';

export default function NavbarButton({children, icon, path}) {
    const router = useRouter();
    return (
        <MotionButton icon={icon} colorScheme={router.pathname === path ? "pink":"teal"} onClick={() => router.push(path)} >
            {children}
        </MotionButton>
    )
}