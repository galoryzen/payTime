import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import PaymentMethod from '../utils/createPayment.js';

function Pay() {
  return (
    <div className='min-h-screen bg-sky-900'>
        <NavBar/>
        <div className='justify-center'>
            <PaymentMethod/>
        </div>
    </div>
  )
}

export default Pay