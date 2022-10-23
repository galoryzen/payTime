import React, { useState } from 'react'
import loginImg from '../../assets/payTime.png'

export default function Login({Login, error}) {
    const [details, setDetails] = useState({name: "", email: "", password: ""});

    const SignUp = (e) => {
        e.preventDefault();
        Login(details);
    }

    const submitHandler = e => {
        e.preventDefault();

        Login(details);
    }
    return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen'>

        <div className='hidden sm:block'>
            <img className='h-screen object-cover' src={loginImg} alt="logo"/>
        </div>
        
        <div className='bg-white flex flex-col justify-center'>
            <form className='max-w-[400px] w-full mx-auto p-8 px-8 rounded-lg shadow-lg' onSubmit={submitHandler}>
                <h2 className='text-4xl dark:text-cyan-800 font-bold text-center shadow-slate-300'>Inicia Sesión</h2>
                <div className='flex flex-col text-gray-700 py-2'>
                    <label htmlFor="email">Email: </label>
                    <input className='rounded-lg bg-white mt-2 p-2 shadow-lg shadow-slate-300 border-solid' type="email" name="email" id="email" onChange={e => setDetails({...details, email: e.target.value})} value={details.email}/>
                </div>
                <div className='flex flex-col text-gray-700 py-2'>
                    <label htmlFor="password">Contraseña: </label>
                    <input className='rounded-lg bg-white mt-2 p-2 shadow-lg shadow-slate-300 border-solid' type="password" name="password" id="password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password}/>
                </div>
                {(error !== "") ? ( <div className="error">{error}</div>) : ""}
                <button className='w-full my-5 py-2 bg-amber-500 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/40 text-white font-semibold rounded-lg'>Login</button>
                
            </form>
        </div>

    </div>
  )
}