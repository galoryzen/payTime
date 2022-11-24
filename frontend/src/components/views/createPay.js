import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import createPay from '../utils/createPayment.jsx'

function CreatePay() {
  return (
    <div className='min-h-scree bg-sky-900'>
      <NavBar/>
      <div className='justify-center'>
        <createPay/>
      </div>
    </div>
  )
}

export default CreatePay