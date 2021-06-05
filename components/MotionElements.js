import { memo, useState } from 'react';
import { motion } from "framer-motion";
import { Box, Button } from '@chakra-ui/react';
import { Fade } from "react-awesome-reveal";

export const MotionBox = motion(Box);
// eslint-disable-next-line react/display-name
export const MotionButton = memo(({children, hidden, disabled, getAttention, icon, colorScheme, ...props}) => {
    const variants = {
        normal: {
            scale: 1,
            rotate: 0,
            opacity: 1,
        },
        hidden: {
            scale: 1,
            rotate: 0,
            opacity: 0,
        },
        getAttention: {
            scale: [1, 1.2, 1.2, 1],
            rotate: [0, -15, 15, 0],
            transition:{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
                loop: Infinity,
                repeatDelay: 0.5,
            },
        }
    }
    let animateState;
    if (hidden) {
        animateState = 'hidden';
    }
    else {
        if (getAttention && !disabled) {
            animateState = 'getAttention';
        }
        else {
            animateState = 'normal';
        }
    }

    return (
        <Fade triggerOnce>
            <motion.div variants={variants} animate={animateState} whileHover={{ scale: hidden ? 0 : 1.1 }} whileTap={{ scale: hidden ? 0 : 0.9 }}>
                <Button isDisabled={disabled} leftIcon={icon} colorScheme={colorScheme ? colorScheme : "teal"} {...props}>
                    {children}
                </Button>
            </motion.div>
        </Fade>
    )
});
// eslint-disable-next-line react/display-name
export const MotionGetAttention = memo(({attentionType='rotate', hover=false, children, ...props}) => {
    const variants = {
        normal: {
            scale: 1,
            rotate: 0,
            opacity: 1,
        },
        rotate: {
            scale: [1, 1.2, 1.2, 1],
            rotate: [0, -10, 10, 0],
            transition:{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
                loop: Infinity,
                repeatDelay: 2,
            },
        },
        expand: {
            scale: [1, 1.2, 1],
            transition:{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                loop: Infinity,
                repeatDelay: 1,
            },
        }
    }
    const [animateState, setAnimateState] = useState(attentionType);

    return (
        <Fade triggerOnce>
            <motion.div variants={variants} animate={animateState} whileHover={{ scale: hover ? 1.1 : 1 } }
                onMouseEnter={() => {setAnimateState('normal')}}
                onMouseLeave={() => {setAnimateState(attentionType)}}
                {...props}
            >
                {children}
            </motion.div>
        </Fade>
    )
});

export const initialFormVariants = {
    display: "none",
}
export const formVariants = {
    right: {
        scale: [1, 0],
        x: [0, 1000],
        transition:{
            delay: 0,
            ease: "easeInOut",
            x: { type: "spring", stiffness: 200 },
        },
        transitionEnd: {
            display: "none",
        },
    },
    in: {
        display: 'block',
        scale: 1,
        x: 0,
        transition:{
            delay: 0.8,
            ease: "easeInOut",
            x: { type: "spring", stiffness: 200 },
        }
    },
    left: {
        scale: [1, 0],
        x: [0, -1000],
        transition:{
            delay: 0,
            ease: "easeInOut",
            x: { type: "spring", stiffness: 200 },
        },
        transitionEnd: {
            display: "none",
        },
    }
};