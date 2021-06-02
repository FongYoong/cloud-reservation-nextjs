import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Text } from '@chakra-ui/react';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

function CustomEvent({ event }) {
    // * Math.pow(Math.abs(event.end - event.start) / 36e5, 1/4)
    // const size = Math.round(250  / Math.pow(event.title.length, 1/4)  ) ;
    // fontSize={`${size}%`}
    return (
    <Text >
        {event.title}
    </Text>
    )
}
function CustomAgendaEvent({ event }) {
    return (
        <Text m={2}>
            {event.title}
        </Text>
    )
}

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

export const Calendar = (props) => {
    return (
        <DragAndDropCalendar
            resizable
            selectable="ignoreEvents"
            localizer={localizer}
            defaultView={Views.WEEK}
            steps={60}
            defaultDate={new Date()}
            components={{
                event: CustomEvent,
                agenda: {
                    event: CustomAgendaEvent,
                },
            }}
            {...props}
        />
    )
}

export const dateIsToday = (date) => {
    const today = new Date();
    return date.getDate() == today.getDate() &&
            date.getMonth() == today.getMonth() &&
            date.getFullYear() == today.getFullYear();
}

export const dateIsInFuture = (date) => {
    const currentDate = new Date();
    return date.getTime() > currentDate.getTime();
}

export const datesAreOnSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const transformAvailableDays = (availableDays) => {
    return availableDays.map((d) => {
        if (d === '0') {
            return 1;
        }
        else if (d === '6') {
            return 0;
        }
        else {
            return parseInt(d) + 1;
        }
    });
}
export const checkIfUnavailableDay = (date, availableDays) => {
    const dateIndex = date.getDay();
    for (const d of availableDays) {
        if (dateIndex === d) {
            return false;
        }
    }
    return true;
}

export const checkIfMinutesExist = (date1, date2) => {
    const diffMs = Math.abs(date2 - date1); // milliseconds
    // const diffDays = Math.floor(diffMs / 86400000); // days
    // const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours

    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes'
    if (diffMins === 0) {
        return false;
    }
    else {
        if (( diffMins === 59 || diffMins === 60 ) && date2.getHours() === 23 && date2.getMinutes() === 59) {
            return false;
        }
        else {
            return true;
        }
    }
}

export const checkIfEventClashes = ({start, end, id}, events) => {
    for(const e of events) {
        if (id === e.id) {
            continue;
        }
        if ( (start < e.start && end > e.start) ||
             (start >= e.start && start < e.end) ) {
            return true;
        }
    }
    return false;
}

export const generateEventId = (event) => {
    return event.start.toLocaleString() + event.end.toLocaleString();
}

export const calculateEventHours = (events) => {
    return events.map((event) => {
        return Math.abs(event.end - event.start) / 36e5;
    }).reduce((total, hour) => {
        return total + hour;
    });
}

export const formatEvents = (events) => {
    return events.map((e) => {
        return {
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
        }
    });
}