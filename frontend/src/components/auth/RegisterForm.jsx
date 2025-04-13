import React, { useState } from 'react';
import { useAuth } from '../../contexts/UserContext';
import { register as registerService } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const data = await registerService(username, password);
      login(data.user);
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div>
        <label
          className='block text-gray-700 text-sm font-bold mb-2'
          htmlFor='username'
        >
          Username
        </label>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='username'
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          className='block text-gray-700 text-sm font-bold mb-2'
          htmlFor='password'
        >
          Password
        </label>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          className='block text-gray-700 text-sm font-bold mb-2'
          htmlFor='confirmPassword'
        >
          Confirm Password
        </label>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='confirmPassword'
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className='text-red-500 text-xs italic'>{error}</p>}
      <div className='flex items-center justify-between'>
        <button
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          type='submit'
        >
          Register
        </button>
        <button
          className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'
          type='button'
          onClick={onToggle}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
