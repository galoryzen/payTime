import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import DetailsCard from '../utils/DetailsCard.jsx';
import PaymentMethod from '../utils/createPayment.jsx';

function Pay() {
  return (
    <div className='h-screen bg-sky-900'>
        <NavBar/>
        <div className='justify-center'>
            <PaymentMethod/>
        </div>
    </div>
  )
}

export default Pay