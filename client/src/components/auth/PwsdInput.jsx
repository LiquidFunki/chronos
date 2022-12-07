import React, { useState } from 'react';
import { BsEyeFill, BsEyeSlashFill, BsLockFill } from 'react-icons/bs';

export const PswdInput = ({ changeHandler, passwordInput, isRepeated }) => {
  const [passwordType, setPasswordType] = useState('password');

  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };
  return (
    <div className='flex items-center justify-center w-full border border-green-500 rounded-md hover:shadow-md hover:shadow-green-400'>
      <BsLockFill color='green' className='mx-3' />

      <input
        required
        type={passwordType}
        onChange={changeHandler}
        value={passwordInput}
        name={isRepeated ? 'repeatedPassword' : 'password'}
        className='w-full bg-transparent border-0 p-3 focus:outline-none focus:border-0'
        placeholder={isRepeated ? 'Repeate password' : 'Password'}
      />
      <div onClick={togglePassword} className='d-flex align-items-center'>
        {passwordType === 'password' ? (
          <BsEyeSlashFill color='green' className='mx-3'/>
        ) : (
          <BsEyeFill color='green' className='mx-3' />
        )}
      </div>
    </div>
  );
};
