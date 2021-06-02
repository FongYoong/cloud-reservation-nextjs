import { useRouter } from 'next/router';
import Link from 'next/link';
import { MotionButton } from './MotionElements';

export default function NavbarButton({children, getAttention=false, icon, path, ...props}) {
    const router = useRouter();
    return (
        <MotionButton getAttention={getAttention} icon={icon} colorScheme={router.pathname === path ? "pink":"teal"} onClick={() => router.push(path)} {...props} >
            <Link href={path} >
                {children}
            </Link>
        </MotionButton>
    )
}