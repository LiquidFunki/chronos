import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import { useMessage } from '../../hooks/message.hook';
import { editEventOff } from '../../store/modalSlice';
import { setSuccessFalse, updateEvent } from '../../store/eventSlice';
import { eventTypes } from '../../utils/event.utils';

export const EditEventForm = () => {
  const dispatch = useDispatch();
  const message = useMessage();

  const { isLoading, success, event } = useSelector((state) => state.event);
  const [form, setForm] = useState({
    name: event.name,
    description: event.description,
    color: event.color,
    type: event.type,
    allDay: event.allDay,
    startEvent: new Date(event.startEvent || new Date())
      .toISOString()
      .substring(0, 16),
    endEvent: new Date(event.endEvent || new Date())
      .toISOString()
      .substring(0, 16),
  });

  useEffect(() => {
    setForm({
      name: event.name,
      description: event.description,
      color: event.color,
      type: event.type,
      allDay: event.allDay,
      startEvent: new Date(event.startEvent || new Date())
        .toISOString()
        .substring(0, 16),
      endEvent: new Date(event.endEvent || new Date())
        .toISOString()
        .substring(0, 16),
    });
  }, [event]);

  useEffect(() => {
    if (success) {
      setForm({
        name: event.name,
        description: event.description,
        type: event.type,
        color: event.color,
        allDay: event.allDay,
        startEvent: event.startEvent,
        endEvent: event.endEvent,
      });
      dispatch(editEventOff());
      dispatch(setSuccessFalse());
    }
  }, [success]);

  const changeHandler = (item) => {
    if (item.target.name === 'allDay') {
      setForm({ ...form, [item.target.name]: !form.allDay });
    } else {
      setForm({ ...form, [item.target.name]: item.target.value });
    }
  };

  const editHandler = (item) => {
    item.preventDefault();
    if (form.allDay) {
      setForm({
        ...form,
        endEvent: new Date(form.startEvent)
          .toISOString(),
      });
    }
    if (
      (new Date(form.startEvent).getTime() > new Date(form.endEvent).getTime()) && !form.allDay
    ) {
      return message('Bad date', 'error');
    }
    dispatch(
      updateEvent({
        ...form,
        _id: event._id,
        startEvent: new Date(form.startEvent).toISOString(),
        endEvent: new Date(
          form.endEvent || new Date(form.startEvent)
        ).toISOString(),
      })
    );
  };
  return (
    <form
      onSubmit={editHandler}
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
          isSearchable
          name='type'
          onChange={(option) => {
            setForm({ ...form, type: option.value });
          }}
          placeholder={`${form.type}`}
          options={eventTypes}
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
        Save changes
      </button>
    </form>
  );
};
