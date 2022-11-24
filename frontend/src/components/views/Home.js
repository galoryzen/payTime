import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import User from '../utils/User.jsx';
import CreditCard from '../utils/CreditCard.jsx';
import LastPayments from '../utils/LastPayments.jsx';
import useFetchUser from '../../hooks/useFetchUser.js';

function Home() {

  const { user, loading} = useFetchUser();

  return (
    <div className='min-h-screen bg-sky-900'>
      <NavBar/>
        <div className=''>
          <div className='flex justify-evenly	py-16'>
            <User nombre={user.name} email={user.email}/>
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