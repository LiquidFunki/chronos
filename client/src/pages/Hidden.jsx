import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { HiSearch } from 'react-icons/hi';
import { CalendarCard } from '../components/calendar/CalendarCard';
import { getAllCalendars } from '../store/calendarSlice';
import { Loader } from '../components/Loader';

export const Hidden = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [calendars, setCalendars] = useState([]);
  const { hiddenCalendars, isLoading } = useSelector((state) => state.calendar);
  useEffect(() => {
    dispatch(getAllCalendars());
  }, []);

  useEffect(() => {
    setCalendars(hiddenCalendars);
  }, [hiddenCalendars]);

  const searchHandler = (e) => {
    setSearch(e.target.value);
    const tempTags = [...hiddenCalendars];
    setCalendars(
      tempTags.filter((value) => value.name.toLowerCase().includes(e.target.value.toLowerCase()))
    );
  };

  if (isLoading) {
    <Loader />;
  }
  return (
    <div className='container m-auto justify-end flex flex-col-reverse lg:flex-row w-full h-screen'>
      <div className='overflow-y-auto mt-6 h-3/6 lg:h-5/6 w-full'>
        <div className='flex mx-5 my-2 justify-between'>
          <h1 className='text-2xl my-2'>Hidden calendars</h1>
          <div className='flex items-center justify-center w-1/2 lg:w-1/3 border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
            <HiSearch color='green' size='30' className='mx-3' />
            <input
              type='text'
              onChange={searchHandler}
              value={search}
              name='search'
              className='w-full bg-transparent border-0 p-3 focus:outline-none focus:border-0'
              placeholder='Search...'
            />
          </div>
        </div>
        {calendars.length ? (
          <div className='flex mx-5 my-6 flex-wrap'>
            {calendars.map((calendar, idx) => (
              <CalendarCard key={idx} calendar={calendar} />
            ))}
          </div>
        ) : (
          <div className='flex mx-5 my-6 flex-wrap'>
            <h2 className='text-xl'>Oops! Nothing found..</h2>
          </div>
        )}
      </div>
    </div>
  );
};
