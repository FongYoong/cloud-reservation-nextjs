import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { HStack, Icon } from '@chakra-ui/react';

export default function Ratings ({onChange = () => {}, initialStars = 0, fixed=false, ...props}) {
    const [currentStars, setCurrentStars] = useState(initialStars);
    const [hoverStars, setHoverStars] = useState(0);
    useEffect(() => {
        if (currentStars > 0) {
            onChange(currentStars);
        }
    }, [currentStars]);
    return (
        <HStack {...props} >
            {[...Array(5).keys()].map((i) => (
                <Star fixed={fixed} key={i} stars={i} fill={i < currentStars || i < hoverStars}
                onClick={() => {
                    if(!fixed) {
                        setCurrentStars(i + 1);
                    }  
                }}
                setHoverStars={setHoverStars}/>
            ))
            }
        </HStack>
    )
}

const Star = ({stars, fill, onClick, setHoverStars, fixed, ...props}) => {
    const [fillState, setFillState] = useState(fill);
    const animateState = (!fill && fillState) || fill ? "fill" : "normal";
    const delay = 0.05;
    const variants = {
        normal: {
            backgroundColor: '#ffffff',
            transition:{
                delay: 6 * delay - delay * stars,
                type: "tween",
            },
        },
        fill: {
            backgroundColor: '#ffea00',
            transition:{
                delay: delay * stars,
                type: "tween",
            },
        },
    }
    useEffect(() => {
        setFillState(fill);
    }, [fill]);
    return (
        <motion.div variants={variants} animate={animateState} style={{borderRadius:"2em"}} onClick={onClick}
            onMouseEnter={ () => {
                if (!fixed) {
                    setFillState(true);
                    setHoverStars(stars);
                }
            }}
            onMouseLeave={ () => {
                if (!fill && !fixed) {
                    setFillState(false);
                    setHoverStars(0);
                }
            }} 
            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} {...props} >
            <Icon w={8} h={8}  color="yellow.500" >
                <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.326
                18.266l-4.326-2.314-4.326 2.313.863-4.829-3.537-3.399
                4.86-.671 2.14-4.415 2.14 4.415 4.86.671-3.537 3.4.863 4.829z"/>
            </Icon>
        </motion.div>
    )
}