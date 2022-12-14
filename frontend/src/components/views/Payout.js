import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import DetailsCard from '../utils/DetailsCard.jsx';
import PaymentMethod from '../utils/PaymentMethod';

function Payout() {
  return (
    <div className='min-h-screen bg-sky-900'>
        <NavBar/>
        <div className='justify-center'>
          <DetailsCard/>
          <div className=''>
            <PaymentMethod/>
          </div>
        </div>
    </div>
  )
}

export default Payout