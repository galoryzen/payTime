import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import PaymentMethod from '../utils/DetailsCard.jsx';

function Transfer() {
  return (
    <div className='min-h-screen bg-sky-900'>
        <NavBar/>
        <div className='justify-center'>
            <PaymentMethod/>
        </div>
        <div className='mt-16 mx-auto w-8/12 text-center bg-white rounded-lg border shadow-md sm:p-8 dark:bg-sky-800 dark:border-cyan-900'>
            <h1>
                PaymentMethod
            </h1>
        </div>
    </div>
  )
}

export default Transfer