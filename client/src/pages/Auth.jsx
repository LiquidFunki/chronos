import React, { useState } from 'react';
import { Login } from '../components/auth/Login';
import { PswdResetForm } from '../components/auth/PswdResetForm';
import { Register } from '../components/auth/Register';

export const Auth = () => {
  const [formType, setFormType] = useState('login');

  return (
    <div className='flex justify-center mt-5'>
      <div className='flex justify-center items-center w-11/12 lg:w-1/3 '>
        {formType === 'login' && <Login setFormType={setFormType} />}
        {formType === 'pswdReset' && (
          <PswdResetForm setFormType={setFormType} />
        )}
        {formType === 'register' && <Register setFormType={setFormType} />}
      </div>
    </div>
  );
};
