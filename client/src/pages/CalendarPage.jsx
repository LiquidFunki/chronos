import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getCalendar, getMainCalendar } from '../store/calendarSlice';
import { getAllEvents } from '../store/eventSlice';
import { BigCalendar } from '../components/calendar/BigCalendar';
import { Loader } from '../components/Loader';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { infoCalendarOn } from '../store/modalSlice';

export const CalendarPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentCalendar, isLoading: calendarLoading } = useSelector(
    (state) => state.calendar
  );
  const { events, isLoading: eventLoading } = useSelector(
    (state) => state.event
  );

  useEffect(() => {
    if (id === 'main') {
      dispatch(getMainCalendar());
    } else {
      dispatch(getCalendar({ id }));
    }
  }, [id]);

  useEffect(() => {
    if (currentCalendar._id) {
      dispatch(getAllEvents({ id: currentCalendar._id }));
    }
  }, [currentCalendar._id]);

  if (calendarLoading || eventLoading) {
    return <Loader />;
  }

  return (
    <div className='container w-full flex flex-col mx-auto p-3'>
      <div className='w-full flex justify-between items-center mb-2 p-3'>
        <h1 className='text-2xl'>
          <b>{currentCalendar.name}</b> calendar
        </h1>
        <button
        onClick={() => {
          dispatch(infoCalendarOn());
        }}
        className='p-3 border shadow-md hover:bg-gray-200 hover:shadow-green-200 border-green-300 rounded-md'>
          More info
        </button>
      </div>
      <div
        className='w-full flex p-3 border shadow-md shadow-green-200 border-green-300 rounded-md'
        style={{ height: '80vh' }}>
        <BigCalendar calendar={currentCalendar} events={events} />
      </div>
    </div>
  );
};
