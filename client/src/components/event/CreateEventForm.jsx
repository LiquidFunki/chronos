import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import { createEventOff } from '../../store/modalSlice';
import { createEvent, setSuccessFalse } from '../../store/eventSlice';
import { eventTypes } from '../../utils/event.utils';

export const CreateEventForm = () => {
  const dispatch = useDispatch();

  const { currentCalendar } = useSelector((state) => state.calendar);
  const { isLoading, success } = useSelector((state) => state.event);
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'task',
    color: '#19c836',
    allDay: false,
    startEvent: '',
    endEvent: '',
  });

  useEffect(() => {
    setForm({
      ...form,
      color:
        // eslint-disable-next-line no-nested-ternary
        form.type === 'reminder'
          ? '#FFA500'
          : form.type === 'arrangement'
            ? '#0000FF'
            : '#008000',
    });
  }, [form.type]);

  useEffect(() => {
    if (success) {
      setForm({
        name: '',
        description: '',
        type: 'task',
        color: '#19c836',
        allDay: false,
        startEvent: '',
        endEvent: '',
      });
      dispatch(createEventOff());
      dispatch(setSuccessFalse());
    }
  }, [success]);

  const changeHandler = (event) => {
    if (event.target.name === 'allDay') {
      setForm({ ...form, [event.target.name]: !form.allDay });
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const createHandler = (event) => {
    event.preventDefault();
    dispatch(
      createEvent({
        ...form,
        id: currentCalendar._id,
        startEvent: new Date(form.startEvent).toISOString(),
        endEvent: new Date(
          form.endEvent || new Date(form.startEvent)
        ).toISOString(),
      })
    );
  };
  return (
    <form
      onSubmit={createHandler}
      className='flex flex-col justify-center items-center w-full mb-4'>
      <label htmlFor='name' className='self-start'>
        Name:
      </label>
      <div className='flex tems-center justify-center w-full border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
        <input
          type='text'
          required
          onChange={changeHandler}
          value={form.name}
          name='name'
          className='w-full bg-transparent border-0 p-3 focus:border-0 focus:outline-none focus:border-green-400'
          placeholder='Name'
        />
      </div>
      <label htmlFor='desc' className='self-start'>
        Description:
      </label>
      <div className='flex items-center justify-center w-full border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
        <textarea
          type='text'
          required
          onChange={changeHandler}
          value={form.description}
          name='description'
          className='w-full bg-transparent border-0 p-3 focus:border-0 focus:outline-none focus:border-green-400'
          placeholder='Description'
        />
      </div>
      <label htmlFor='desc' className='self-start'>
        Type:
      </label>
      <div className='flex items-center w-full border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
        <Select
          className='w-full'
          classNamePrefix='select'
          isClearable
          isSearchable
          name='type'
          onChange={(option) => setForm({ ...form, type: option.value })}
          placeholder='Select event type'
          options={eventTypes}
          defaultValue={eventTypes[0]}
        />
      </div>
      <div className='flex items-center justify-center self-start'>
        <input
          id='allDay'
          type='checkbox'
          onChange={changeHandler}
          checked={form.allDay}
          name='allDay'
          className='ml-1 mr-3 my-2 rounded-sm'
        />
        <label htmlFor='allDay' className='cursor-pointer'>make this event an all day event</label>
      </div>
      <div className='flex items-center self-start w-full'>
        <label htmlFor='start' className='text-xl mr-3'>
          Start at:
        </label>
        <input
          required
          type='datetime-local'
          name='startEvent'
          value={form.startEvent}
          className='w-1/2 ml-1 mr-3 my-2 rounded-sm'
          onChange={changeHandler}
        />
      </div>
      <div className='flex items-center self-start w-full'>
        <label htmlFor='start' className='text-xl mr-3'>
          End at:
        </label>
        <input
          required={!form.allDay}
          type='datetime-local'
          name='endEvent'
          value={form.allDay ? '' : form.endEvent}
          className='w-1/2 ml-1 mr-3 my-2 rounded-sm'
          onChange={changeHandler}
        />
      </div>
      <div className='flex items-center self-start w-full'>
        <label htmlFor='start' className='text-xl mr-3'>
          Color:
        </label>
        <input
          type='color'
          name='color'
          value={form.color}
          className='w-1/2 ml-1 mr-3 my-2 rounded-sm'
          onChange={changeHandler}
        />
      </div>
      <button
        type='submit'
        className='mt-2 mb-2 w-full text-white rounded-md bg-green-500 p-3 hover:bg-green-600 hover:shadow-md hover:shadow-green-400'
        disabled={isLoading}>
        Create event
      </button>
    </form>
  );
};
