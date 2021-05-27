import { useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const generateEventId = (event) => {
  return event.start.toLocaleString() + event.end.toLocaleString();
};

const initialEvents = [
  {
    id: 0,
    title: "Board meeting",
    start: new Date(2018, 0, 29, 9, 0, 0),
    end: new Date(2018, 0, 29, 13, 0, 0)
  },
  {
    id: 1,
    title: "MS training",
    start: new Date(2018, 0, 29, 14, 0, 0),
    end: new Date(2018, 0, 29, 16, 30, 0)
  },
  {
    id: 2,
    title: "Team lead meeting",
    start: new Date(2018, 0, 29, 8, 30, 0),
    end: new Date(2018, 0, 29, 12, 30, 0)
  },
  {
    id: 11,
    title: "Birthday Party",
    start: new Date(2018, 0, 30, 7, 0, 0),
    end: new Date(2018, 0, 30, 10, 30, 0)
  }
].map((event) => ({
  ...event,
  id: generateEventId(event)
}));

const styles = {
  container: {
    width: "80wh",
    height: "80vh",
    margin: "2em"
  }
};

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

export default function CustomCalendar() {
  const [events, setEvents] = useState(initialEvents);

  const [draggedEvent, setDraggedEvent] = useState(null);

  const dragFromOutsideItem = () => {
    return draggedEvent;
  };
  const onEventDrop = ({
    event,
    start,
    end,
    isAllDay: droppedOnAllDaySlot
  }) => {
    if (!droppedOnAllDaySlot) {
      const nextEvents = events.map((existingEvent) => {
        return existingEvent.id === event.id
          ? {
              ...existingEvent,
              id: generateEventId({ start, end }),
              start,
              end
            }
          : existingEvent;
      });
      setEvents(nextEvents);
    }
  };
  const onEventResize = ({ event, start, end }) => {
    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id
        ? {
            ...existingEvent,
            id: generateEventId({ start, end }),
            start,
            end
          }
        : existingEvent;
    });
    setEvents(nextEvents);
  };
  const onDropFromOutside = ({ start, end }) => {
    const event = {
      id: generateEventId({ start, end }),
      title: draggedEvent.title,
      start,
      end
    };
    setDraggedEvent(null);
    onEventDrop({ event, start, end });
  };
  const handleDragStart = (event) => {
    setDraggedEvent(event);
  };

  return (
    <div style={styles.container}>
      <DragAndDropCalendar
        selectable="ignoreEvents"
        resizable
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        dragFromOutsideItem={dragFromOutsideItem}
        onDropFromOutside={onDropFromOutside}
        handleDragStart={handleDragStart}
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        steps={60}
        defaultDate={new Date(2018, 0, 29)}
      />
    </div>
  );
}
