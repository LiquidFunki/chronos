import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import invert from 'invert-color';
import { useDispatch, useSelector } from 'react-redux';
import {
  eventDateUpdate,
  eventsToCalendar,
  getEditEventDate,
} from '../../utils/event.utils';
import { useMessage } from '../../hooks/message.hook';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvent, updateEvent } from '../../store/eventSlice';
import { createEventOn, infoEventOn } from '../../store/modalSlice';
import { getAllUsers } from '../../store/userSlice';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export const BigCalendar = ({ events }) => {
  const message = useMessage();
  const dispatch = useDispatch();

  const { currentCalendar } = useSelector((state) => state.calendar);
  const { me } = useSelector((state) => state.auth);

  const { views } = useMemo(() => ({
    views: { month: true, day: true, week: true },
  }));

  const [displayEvents, setDisplayEvents] = useState([]);

  useEffect(() => {
    setDisplayEvents(eventsToCalendar(events));
  }, [events]);

  const eventPropGetter = useCallback((event) => ({
    ...(event.color && {
      style: { backgroundColor: event.color, color: invert(event.color, true) },
    }),
  }));

  const onEventResize = (data) => {
    if (data.event.type === 'holiday') {
      return message('You can\'t change holiday', 'warning');
    }
    dispatch(updateEvent(getEditEventDate(data)));
    setDisplayEvents(eventDateUpdate(displayEvents, data));
  };

  const onEventDrop = (data) => {
    if (data.event.type === 'holiday') {
      return message('You can\'t interact with holiday', 'warning');
    }
    dispatch(updateEvent(getEditEventDate(data)));
    setDisplayEvents(eventDateUpdate(displayEvents, data));
  };

  return (
    <DnDCalendar
      eventPropGetter={eventPropGetter}
      views={views}
      defaultDate={moment().toDate()}
      defaultView='month'
      events={displayEvents}
      localizer={localizer}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      onSelectSlot={() => {
        if (
          currentCalendar.participants.some((itm) => itm._id === me.id)
          || currentCalendar.author._id === me.id
        ) {
          dispatch(createEventOn());
        }
      }}
      onSelectEvent={(slotInfo) => {
        dispatch(getEvent({ id: slotInfo._id }));
        dispatch(getAllUsers());
        dispatch(infoEventOn());
      }}
      resizable
      selectable
      className='w-full h-full animate-appear'
    />
  );
};
