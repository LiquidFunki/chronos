import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiAtSymbol } from 'react-icons/hi';

import { resetPswd } from '../../store/authSlice';

export const PswdResetForm = ({ setFormType }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: '',
  });
  const { isLoading, isAuthenticated, success } = useSelector(
    (state) => state.auth
  );

  const resetHandler = (e) => {
    e.preventDefault();
    dispatch(resetPswd(form));
  };

  useEffect(() => {
    if (isAuthenticated || success) {
      dispatch(ResetPswdOff());
    }
  }, [isAuthenticated, success]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <form
      onSubmit={resetHandler}
      className='flex flex-col justify-center items-center w-full'>
      <h2 className='text-2xl'>Reset password</h2>
      <p className='self-start pl-3 pr-1 text-start'>
        Enter the email from the account for which you want to reset the
        password. We will send a password reset link to this email.
      </p>
      <label htmlFor='email' className='self-start py-3'>
        Email:
      </label>
      <div className='flex items-center justify-center w-full border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
        <HiAtSymbol color='green' className='mx-3' />
        <input
          type='email'
          required
          onChange={changeHandler}
          value={form.email}
          name='email'
          className='w-full bg-transparent border-0 p-3 focus:border-0 focus:outline-none focus:border-green-400'
          placeholder='Email'
        />
      </div>
      <button type='submit' className='mt-2 mb-2 w-full text-white rounded-md bg-green-500 p-3 hover:bg-green-600 hover:shadow-md hover:shadow-green-400' disabled={isLoading}>
        Send mail
      </button>
      <span>
        Back to
        <span
          className='text-green-300 cursor-pointer'
          onClick={() => setFormType('login')}>
          {'  '}
          Sign In
        </span>
      </span>
    </form>
  );
};
