import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import loginImg from '../../assets/payTime.png';
import useToken from '../../hooks/useToken';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { token, setToken } = useToken();

  console.log('token', token);

  if (token) {
    return <Navigate to='/home' />;
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(email, password);
    axios
      .post(
        'http://localhost:3000/login',
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        setToken(res.data);
      });
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 min-h-screen'>
      <div className='hidden sm:block'>
        <img className='min-h-screen object-cover' src={loginImg} alt='logo' />
      </div>

      <div className='bg-white flex flex-col justify-center'>
        <form
          className='max-w-[400px] w-full mx-auto p-8 px-8 rounded-lg shadow-lg'
          onSubmit={submitHandler}
        >
          <h2 className='text-4xl dark:text-cyan-800 font-bold text-center shadow-slate-300'>
            Inicia Sesión
          </h2>
          <div className='flex flex-col text-gray-700 py-2'>
            <label htmlFor='email'>Email: </label>
            <input
              className='rounded-lg bg-white mt-2 p-2 shadow-lg shadow-slate-300 border-solid'
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id='email'
            />
          </div>
          <div className='flex flex-col text-gray-700 py-2'>
            <label htmlFor='password'>Contraseña: </label>
            <input
              className='rounded-lg bg-white mt-2 p-2 shadow-lg shadow-slate-300 border-solid'
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id='password'
            />
          </div>
          <button className='w-full my-5 py-2 bg-amber-500 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/40 text-white font-semibold rounded-lg'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
