import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { MotionButton, MotionBox, formVariants, initialFormVariants } from '../MotionElements';
import { Calendar, dateIsInFuture, datesAreOnSameDay, days, checkIfUnavailableDay, checkIfMinutesExist,
    checkIfEventClashes, generateEventId, calculateEventHours
} from '../Calendar';
import { Views } from "react-big-calendar";
import { useToast, Box, Flex, Text, Stack, HStack, VStack, Button, Heading, Stat, StatLabel, StatNumber, StatHelpText, Tag, TagLabel, Divider,
    useColorModeValue,
    Input, InputGroup, InputLeftAddon, Textarea, NumberInput, NumberInputField,
    FormControl, FormLabel, FormErrorMessage,
    useDisclosure,
    Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
} from '@chakra-ui/react';

import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { TiTickOutline } from 'react-icons/ti';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const processPriceValue = (price) => {
    return parseFloat(parseFloat(price).toFixed(2));
}
const processQuantityValue = (quantity) => {
    return Math.round(quantity);
}

export default function OrderForm({ update, serviceType, serviceData, completeFormHandler }) {
    const toast = useToast();
    const [formSchema, setFormSchema] = useState(null);
    useEffect(() => {
        if (serviceType === 'service') {
            setFormSchema(
                Yup.object().shape({
                    proposedPricePerHour: Yup.number()
                        .positive('Price must be positive')
                        .min(serviceData.minPrice, "Price is lower than the minimum!")
                        .required('Required'),
                    userRemarks: Yup.string().required('Required'),
                    address: Yup.string().required('Required'),
                })
            );
            setInitialDetails({
                proposedPricePerHour: serviceData.minPrice,
                userRemarks: '',
                address: '',
            })
        }
        else {
            setFormSchema(
                Yup.object().shape({
                    quantity: Yup.number().positive('Quantity must be positive').required('Required'),
                    userRemarks: Yup.string().required('Required'),
                    address: Yup.string().required('Required'),
                })
            )
            setInitialDetails({
                quantity: 1,
                userRemarks: '',
                address: '',
            })
        }
    }, [serviceType, serviceData]);

    const [formState, setFormState] = useState(0);

    const changeFormState = (change) => {
        if (formState < 1 || change === -1) {
            setFormState(formState + change);
        }
        else {
            completeFormHandler({details, calendarEvents})
        }
    }

    let detailsTrans, eventsTrans;
    if (formState === 0) {
        detailsTrans = 'in';
        eventsTrans = 'right';
    }
    if (formState === 1) {
        detailsTrans = 'left';
        eventsTrans = 'in';
    }

    const [initialDetails, setInitialDetails] = useState(null);
    const [detailsConfirmed, setDetailsConfirmed] = useState(false);
    const [details, setDetails] = useState({});
    const [tempTitle, setTempTitle] = useState('');
    const [tempStart, setTempStart] = useState(new Date());
    const [tempEnd, setTempEnd] = useState(new Date());

    // Calendar
    const [availableDays, _] = useState(serviceData.availableDays ? serviceData.availableDays.map((d) => {
        if (d === '0') {
            return 1;
        }
        else if (d === '6') {
            return 0;
        }
        else {
            return parseInt(d) + 1;
        }
    }) : null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [totalHours, setTotalHours] = useState(0);

    useEffect(() => {
        if (calendarEvents.length > 0) {
            const hours = calculateEventHours(calendarEvents);
            setTotalHours(hours);
        }
        else {
            setTotalHours(0);
        }
    }, [calendarEvents]);

    const eventTitleRef = useRef();
    const addEventModal = useDisclosure();
    const deleteEventModal = useDisclosure();
    const addEventHandler = () => {
        setCalendarEvents([...calendarEvents, {
            id: tempStart.toLocaleString() + tempEnd.toLocaleString(),
            title: tempTitle,
            start: tempStart,
            end: tempEnd,
        }]);
        addEventModal.onClose();
    }
    const deleteEventHandler = () => {
        const index = calendarEvents.findIndex((event) => { return event.id === (tempStart.toLocaleString() + tempEnd.toLocaleString()); });
        const newEvents = [...calendarEvents];
        newEvents.splice(index, 1);
        setCalendarEvents(newEvents);
        deleteEventModal.onClose();
    }
    const validateEvent = (start, end, id, successCallback) => {
        if (dateIsInFuture(start)) {
            if (checkIfUnavailableDay(start, availableDays)) {
                toast({
                    title: `${days[start.getDay()]} is unavailable!`,
                    description: "Choose the days which are NOT red.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
            else {
                if (checkIfMinutesExist(start, end) || start.getTime() === end.getTime()) {
                    toast({
                        title: 'Choose an hourly interval!',
                        description: "The price rate is hourly.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                else {
                    if (checkIfEventClashes({start, end, id}, calendarEvents)) {
                        toast({
                            title: 'Events must not clash!',
                            description: "Services can only run one at a time.",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                    else {
                        successCallback();
                    }
                }
            }
        }
        else {
            toast({
                title: 'Choose a date in the future!',
                description: "Leave the past behind.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }
    // Drag n Drop
    const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true);
    const [draggedEvent, setDraggedEvent] = useState(null);

    const dragFromOutsideItem = () => {
        return draggedEvent;
    }
    const onEventDrop = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
        if (!droppedOnAllDaySlot) {
            if (!datesAreOnSameDay(start, end)) {
                // Amend to 11:59:59pm if 'end' crosses into the next day
                end.setDate(end.getDate() - 1);
                end.setHours(23);
                end.setMinutes(59);
                end.setSeconds(59);
            }
            else if (end.getHours() !== 23 && end.getMinutes() === 59) {
                // Amend if minutes is 59
                end.setHours(end.getHours() + 1);
                end.setMinutes(0);
                end.setSeconds(0);
            }
            const nextEvents = calendarEvents.map(existingEvent => {
                return existingEvent.id == event.id ? {
                    ...existingEvent,
                    id: generateEventId({start, end}),
                    start,
                    end
                } : existingEvent;
            });
            validateEvent(start, end, event.id, () => {setCalendarEvents(nextEvents);});
        }
    }
    const onEventResize = ({ event, start, end }) => {
        const nextEvents = calendarEvents.map(existingEvent => {
            return existingEvent.id == event.id ? {
                ...existingEvent,
                id: generateEventId({start, end}),
                start,
                end,
            } : existingEvent;
        });
        validateEvent(start, end, event.id, () => {setCalendarEvents(nextEvents);});
    }
    const onDropFromOutside = ({ start, end }) => {
        const event = {
            id: generateEventId(draggedEvent),
            title: draggedEvent.title,
            start,
            end,
        };
        setDraggedEvent(null);
        onEventDrop({ event, start, end });
    }
    const handleDragStart = event => {
        setDraggedEvent(event);
    }

    const dayNormalColor = useColorModeValue('#bdffe3', '#02b368');
    const dayUnavailableColor = useColorModeValue('#ff5a47', '#ed1800');
    const dayPastColor = useColorModeValue('#ed1800', '#b30000');

    const getDayColor = (date) => {
        if (!dateIsInFuture(date)) {
            return dayPastColor;
        }
        else if (checkIfUnavailableDay(date, availableDays)) {
            return dayUnavailableColor;
        }
        return dayNormalColor;
    }
    
    return (
        <motion.div
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ type: "tween" }}
        >
            <Stack align={["center", "start"]} justify={["center", "space-between"]} direction={["column", "row"]} spacing="4"  m={2} p={4} borderWidth={2} borderRadius="lg" boxShadow="lg" >
                <MotionButton hidden={formState === 0} icon={<MdNavigateBefore />} variant="outline" colorScheme={"purple"}
                    onClick={() => {
                        changeFormState(-1);
                    }} >
                    Previous
                </MotionButton>
                <motion.div initial={false} variants={formVariants} animate={detailsTrans}>
                    <VStack spacing="4" >
                        { initialDetails &&
                        <Formik
                            initialValues={initialDetails}
                            validationSchema={formSchema}
                            onSubmit={values => {
                                if (serviceType === 'service') {
                                    setDetails({
                                        ...values,
                                        proposedPricePerHour: processPriceValue(values.proposedPricePerHour),
                                    });
                                }
                                else {
                                    setDetails({
                                        ...values,
                                        quantity: processQuantityValue(values.quantity),
                                    });
                                }
                                setDetailsConfirmed(true);
                            }}
                            >
                            {({errors, touched, handleChange}) => (
                            <Form
                                onChange={e => {
                                    setDetailsConfirmed(false);
                                    handleChange(e);
                                }}
                            >
                                <VStack p={4} spacing={4} borderWidth={2} borderRadius="lg" boxShadow="lg">
                                    { serviceType === 'service' ? <>
                                        <motion.div whileHover={{ scale: 1.1 }} >
                                            <Stat p={2} mb={2} borderWidth={2} borderRadius="lg">
                                                <StatLabel>Suggested price by seller</StatLabel>
                                                <StatNumber>RM {serviceData.minPrice.toFixed(2)} ~ {serviceData.maxPrice.toFixed(2)}</StatNumber>
                                            </Stat>
                                        </motion.div>
                                        <Field name="proposedPricePerHour" >
                                            {({ field }) => (
                                            <FormControl isInvalid={errors.proposedPricePerHour && touched.proposedPricePerHour} isRequired>
                                            <FormLabel htmlFor="proposedPricePerHour">Proposed Price per Hour</FormLabel>
                                            <NumberInput id="proposedPricePerHour" defaultValue={initialDetails.proposedPricePerHour} min={0.01} precision={2} >
                                                <HStack>
                                                    <Text>RM</Text>
                                                    <NumberInputField {...field} />
                                                </HStack>
                                            </NumberInput>
                                            <FormErrorMessage>{errors.proposedPricePerHour}</FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                        </> :
                                        <Field name="quantity" >
                                            {({ field }) => (
                                            <FormControl isInvalid={errors.quantity && touched.quantity} isRequired>
                                            <FormLabel htmlFor="quantity">Quantity</FormLabel>
                                            <NumberInput id="quantity" defaultValue={initialDetails.quantity} step={1} min={1} precision={0} >
                                                <NumberInputField {...field} />
                                            </NumberInput>
                                            <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                                            </FormControl>
                                            )}
                                        </Field>
                                    }
                                    <Field name="userRemarks" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.userRemarks && touched.userRemarks} isRequired>
                                        <FormLabel htmlFor="userRemarks">Remarks / Requests</FormLabel>
                                        <Textarea size="sm" id="userRemarks" placeholder="Jett revive me..."  {...field} />
                                        <FormErrorMessage>{errors.userRemarks}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name="address" >
                                        {({ field }) => (
                                        <FormControl isInvalid={errors.address && touched.address} isRequired>
                                        <FormLabel htmlFor="address">Address</FormLabel>
                                        <Textarea size="sm" id="address" placeholder="Home sweet home..."  {...field} />
                                        <FormErrorMessage>{errors.address}</FormErrorMessage>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Button
                                        isLoading={detailsConfirmed}
                                        spinner={<TiTickOutline />}
                                        mt={4}
                                        colorScheme="teal"
                                        type="submit"
                                    >
                                        Confirm
                                    </Button>
                                </VStack>
                            </Form>
                            )}
                        </Formik>
                        }
                    </VStack>
                </motion.div>
                <MotionBox width="100%" initial={initialFormVariants} variants={formVariants} animate={eventsTrans} >
                    <VStack align="center" justify="center" >
                    { serviceType === 'service' ? <>
                        <Heading m="4" textAlign="center">
                            Service Hours
                        </Heading>
                        <HStack>
                            <motion.div whileHover={{ scale: 1.1 }} >
                                <Stat p={2} borderWidth={2} borderRadius="lg">
                                    <StatLabel>Total Price</StatLabel>
                                    <StatNumber>RM {totalHours * (details.proposedPricePerHour)}</StatNumber>
                                    <StatHelpText>Hours: {totalHours}</StatHelpText>
                                    <StatHelpText>Per Hour: RM {details.proposedPricePerHour}</StatHelpText>
                                    <StatHelpText>Events: {calendarEvents.length}</StatHelpText>
                                </Stat>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} >
                                <VStack p={2} >
                                    <Tag size="lg" bg={dayNormalColor} borderRadius="full">
                                        <TagLabel> • Available Days </TagLabel>
                                    </Tag>
                                    <Tag size="lg" bg={dayUnavailableColor} borderRadius="full">
                                        <TagLabel textColor='white' > • Unavailable Days </TagLabel>
                                    </Tag>
                                    <Tag size="lg" bg={dayPastColor} borderRadius="full">
                                        <TagLabel textColor='white' > • Past Days </TagLabel>
                                    </Tag>
                                </VStack>
                            </motion.div>
                        </HStack>
                        <Divider />
                        <Box width="100%" height="30em" >
                            <Calendar
                                dayPropGetter={(date) => ({
                                    style: {
                                        backgroundColor: getDayColor(date)
                                    }
                                })}
                                views={[Views.DAY, Views.WEEK, Views.AGENDA]}
                                defaultView={Views.WEEK}
                                events={calendarEvents}
                                onEventDrop={onEventDrop}
                                onEventResize={onEventResize}
                                dragFromOutsideItem={ displayDragItemInCell ? dragFromOutsideItem : null }
                                onDropFromOutside={onDropFromOutside}
                                handleDragStart={handleDragStart}
                                onSelectEvent={(event) => {
                                    setTempTitle(event.title);
                                    setTempStart(event.start);
                                    setTempEnd(event.end);
                                    deleteEventModal.onOpen();
                                }}
                                onSelectSlot={({start,end}) => {
                                    validateEvent(start, end, null, () => {
                                        setTempTitle('');
                                        setTempStart(start);
                                        setTempEnd(end);
                                        addEventModal.onOpen();
                                    });
                                }}
                            />
                        </Box> </>
                        :
                        <Heading size="md"  m="4" textAlign="center">
                            No custom schedule can be set for products yet.
                            <br /> The items should be delivered as soon as possible.
                        </Heading>
                    }
                    </VStack>
                </MotionBox>
                <MotionButton
                    getAttention={formState === 1}
                    disabled={!detailsConfirmed || (formState === 1 && serviceType==='service' && totalHours < 1)}
                    icon={<MdNavigateNext />} colorScheme={"purple"}
                    onClick={() => {
                        changeFormState(1);
                    }} >
                    {formState < 1 ? "Next":(update ? "Update" : "Create")}
                </MotionButton>
            </Stack>
            <Modal initialFocusRef={eventTitleRef} motionPreset="scale" isCentered={true} isOpen={addEventModal.isOpen} onClose={addEventModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Event</ModalHeader>
                     <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center" justify="center">
                            <Stat p={2} mb={2} borderWidth={2} borderRadius="lg">
                                <StatLabel>{tempStart.toDateString()}</StatLabel>
                                <StatNumber>{tempStart.toLocaleTimeString()} to {tempEnd.toLocaleTimeString()}</StatNumber>
                            </Stat>
                            <form onSubmit={(e) => {
                                    e.preventDefault();
                                    addEventHandler();
                                } }>
                                <InputGroup>
                                    <InputLeftAddon>
                                        Title:
                                    </InputLeftAddon>
                                    <Input ref={eventTitleRef} onChange={(event) => setTempTitle(event.target.value)} defaultValue=''  placeholder="" />
                                </InputGroup>
                            </form>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={addEventHandler} >
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal motionPreset="scale" isCentered={true} isOpen={deleteEventModal.isOpen} onClose={deleteEventModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Event</ModalHeader>
                     <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center" justify="center">
                            <Stat p={2} mb={2} borderWidth={2} borderRadius="lg">
                                <StatLabel>{tempStart.toDateString()}</StatLabel>
                                <StatNumber>{tempStart.toLocaleTimeString()} to {tempEnd.toLocaleTimeString()}</StatNumber>
                                <StatHelpText>Title:&nbsp;{tempTitle}</StatHelpText>
                            </Stat>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={deleteEventHandler} >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </motion.div>
    )
}