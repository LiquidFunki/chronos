import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCalendar, setSuccessFalse } from '../../store/calendarSlice';
import { createCalendarOff } from '../../store/modalSlice';

export const CalendarCreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, success } = useSelector((state) => state.calendar);
  const [form, setForm] = useState({
    name: '',
    description: '',
    isPublic: true,
  });

  useEffect(() => {
    if (success) {
      navigate('/home');
      setForm({
        name: '',
        description: '',
        isPublic: true,
      });
      dispatch(createCalendarOff());
      dispatch(setSuccessFalse());
    }
  }, [success]);

  const changeHandler = (event) => {
    if (event.target.name === 'isPublic') {
      setForm({ ...form, [event.target.name]: !form.isPublic });
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const createHandler = (event) => {
    event.preventDefault();
    dispatch(createCalendar(form));
  };
  return (
    <form
      onSubmit={createHandler}
      className='flex flex-col justify-center items-center w-full mb-4'>
      <label htmlFor='password' className='self-start'>
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
      <label htmlFor='password' className='self-start'>
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
      <div className='flex items-center justify-center self-start'>
        <input
          id='public'
          type='checkbox'
          onChange={changeHandler}
          checked={!form.isPublic}
          name='isPublic'
          className='ml-1 mr-3 my-2 rounded-sm'
        />
        <label htmlFor='public' className='cursor-pointer'>
          make it private
        </label>
      </div>
      <button
        type='submit'
        className='mt-2 mb-2 w-full text-white rounded-md bg-green-500 p-3 hover:bg-green-600 hover:shadow-md hover:shadow-green-400'
        disabled={isLoading}>
        Create calendar
      </button>
    </form>
  );
};
