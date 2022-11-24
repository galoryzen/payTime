import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import User from '../utils/User.jsx';
import CreditCard from '../utils/CreditCard.jsx';
import LastPayments from '../utils/LastPayments.jsx';
import useFetchUser from '../../hooks/useFetchUser.js';

function Home() {

  var { user, loading} = useFetchUser();

  if(user !== undefined){
    localStorage.setItem('user', JSON.stringify(user));
    console.log(JSON.parse(localStorage.getItem('user')).name);
  }

  if(user === undefined){
    user = JSON.parse(localStorage.getItem('user'));
    
  }

  console.log(user);

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