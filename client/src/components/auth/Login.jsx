import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoPersonSharp } from 'react-icons/io5';

import { signIn } from '../../store/authSlice';
import { PswdInput } from './PwsdInput';

export const Login = ({ setFormType }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    login: '',
    password: '',
  });
  const { isLoading } = useSelector((state) => state.auth);

  const signInHandler = (e) => {
    e.preventDefault();
    if (!form.login.length || !form.password.length) {
      message('All fields must be filled', 'error');
    } else {
      dispatch(signIn(form));
    }
  };

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <form
      onSubmit={signInHandler}
      className='flex flex-col justify-center items-center w-full'>
      <h1 className='text-2xl'>Sign In</h1>
      <label htmlFor='login' className='self-start py-2'>
        Login:
      </label>
      <div className='flex items-center justify-center w-full border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
        <IoPersonSharp color='green' className='mx-3' />
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
      <label htmlFor='password' className='self-start py-2'>
        Password:
      </label>
      <PswdInput changeHandler={changeHandler} passwordInput={form.password} />
      <span className='mt-3'>
        Forgot your password?
        <span
          className='text-green-500 cursor-pointer'
          onClick={() => setFormType('pswdReset')}>
          {'  '}
          Reset
        </span>
      </span>
      <button type='submit' className='mt-2 mb-2 w-full text-white rounded-md bg-green-500 p-3 hover:bg-green-600 hover:shadow-md hover:shadow-green-400' disabled={isLoading}>
        Sign In
      </button>
      <p>
        Don’t have an account?
        <span
          className='text-green-500 cursor-pointer'
          onClick={() => setFormType('register')}>
          {'  '}
          Sign Up
        </span>
      </p>
    </form>
  );
};
