import { Button } from '@chakra-ui/react';
import { motion } from "framer-motion";

export function MotionButton({children, icon, colorScheme, ...props}) {
    return (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button leftIcon={icon} colorScheme={colorScheme ? colorScheme : "teal"} {...props}>
                {children}
            </Button>
        </motion.div>
    )
}