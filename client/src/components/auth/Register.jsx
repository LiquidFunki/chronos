import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillPersonFill } from 'react-icons/bs';
import { HiAtSymbol } from 'react-icons/hi';
import { MdLabel } from 'react-icons/md';

import { PswdInput } from './PwsdInput';
import { signUp } from '../../store/authSlice';

export const Register = ({ setFormType }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    login: '',
    email: '',
    password: '',
    repeatedPassword: '',
    fullName: '',
  });
  const { isLoading } = useSelector(
    (state) => state.auth
  );

  const signUpHandler = (e) => {
    e.preventDefault();
    dispatch(signUp(form));
  };

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <form
      onSubmit={signUpHandler}
      className='flex flex-col justify-center items-center w-full'>
      <h1 className='text-2xl'>Sign Up</h1>
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
      <label htmlFor='login' className='self-start py-2'>
        Login:
      </label>
      <div className='flex items-center justify-center w-full border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
        <BsFillPersonFill color='green' className='mx-3' />
        <input
          required
          type='text'
          onChange={changeHandler}
          value={form.login}
          name='login'
          className='w-full bg-transparent border-0 p-3 focus:border-0 focus:outline-none focus:border-green-400'
          placeholder='Login'
        />
      </div>
      <label htmlFor='FullName' className='self-start py-2'>
        Full name:
      </label>
      <div className='flex items-center justify-center w-full border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
        <MdLabel color='green' className='mx-3' />
        <input
          required
          type='text'
          onChange={changeHandler}
          value={form.fullName}
          name='fullName'
          className='w-full bg-transparent border-0 p-3 focus:border-0 focus:outline-none focus:border-green-400'
          placeholder='Full name'
        />
      </div>
      <label htmlFor='password' className='self-start py-2'>
        Password:
      </label>
      <PswdInput changeHandler={changeHandler} passwordInput={form.password} />
      <label htmlFor='password' className='self-start py-2'>
        Repeat password:
      </label>
      <PswdInput
        changeHandler={changeHandler}
        passwordInput={form.repeatedPassword}
        isRepeated
      />
      <button
        type='submit'
        className='my-4  w-full text-white rounded-md bg-green-500 p-3 hover:bg-green-600 hover:shadow-md hover:shadow-green-400'
        disabled={isLoading}>
        Sign Up
      </button>
      <p>
        Already have an account?
        <span
          className='text-green-500 cursor-pointer'
          onClick={() => setFormType('login')}>
          {'  '}
          Sign In
        </span>
      </p>
    </form>
  );
};
