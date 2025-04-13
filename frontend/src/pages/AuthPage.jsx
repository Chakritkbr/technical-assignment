import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        {isLogin ? (
          <LoginForm onToggle={toggleAuth} />
        ) : (
          <RegisterForm onToggle={toggleAuth} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
