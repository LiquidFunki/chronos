import moment from 'moment';

export const updateEventUtil = (events, event) => [...events
  .filter((item) => item._id !== event._id), event];

export const eventsToCalendar = (events) => events.map((item) => ({
  ...item,
  start: moment(item.startEvent).toDate(),
  end: moment(item.endEvent).toDate(),
  title: item.name,
}));

export const getEditEventDate = (data) => ({
  ...data.event,
  startEvent: data.start.toString(),
  start: data.start,
  endEvent: data.end.toString(),
  end: data.end,
  allDay: data.isAllDay || false
});

export const eventDateUpdate = (events, data) => events.map((item) => {
  if (data.event._id === item._id) {
    return {
      ...item,
      startEvent: data.start.toString(),
      start: data.start,
      endEvent: data.end.toString(),
      end: data.end,
      allDay: data.isAllDay,
    };
  }
  return item;
});

export const eventTypes = [
  { value: 'task', label: 'Task' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'arrangement', label: 'Arrangement' },
];
