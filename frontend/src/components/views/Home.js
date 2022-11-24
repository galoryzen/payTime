import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import User from '../utils/User.jsx';
import CreditCard from '../utils/CreditCard.jsx';
import LastPayments from '../utils/LastPayments.jsx';

function Home() {
  return (
    <div className='min-h-screen bg-sky-900'>
      <NavBar/>
        <div className=''>
          <div className='flex justify-evenly	py-16'>
            <User/>
            <CreditCard/>
          </div>
      
        <div className=''>
          <LastPayments/>
        </div>

      </div>
    </div>
  );
}

export default Home;