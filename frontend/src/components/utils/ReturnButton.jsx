import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReturnButton() {
  let navigate = useNavigate();
  return (
    <div className='flex justify-center w-fit'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center text-white bg-black/25 border-0 py-2 px-6 outline-none hover:bg-black/50 duration-150 ease-in-out transition-all rounded-full text-lg'
      >
        <i className='fa-solid fa-arrow-left-long mr-2'></i> Volver
      </button>
    </div>
  );
}
