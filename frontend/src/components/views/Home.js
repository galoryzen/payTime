import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import User from '../utils/User.jsx';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import LastPayments from '../utils/LastPayments.jsx';
import ReactLoading from 'react-loading';
import useFetchUser from '../../hooks/useFetchUser.js';
import useFetchCards from '../../hooks/useFetchCards';

function Home() {

  var { user, loading} = useFetchUser();
  var { cards: metodosPago, load } = useFetchCards();

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
          <div className='flex justify-center items-center py-16 gap-32'>
            <User nombre={user.name} email={user.email}/>
            {loading ? (
            <div className='w-full h-[182.859px] flex justify-center items-center'>
              <ReactLoading type='bubbles' color='white' height={100} width={100} />
            </div>
          ) : (
            metodosPago.map((metodo, index) => (
              <div className='flex flex-col items-end justify-center select-none '>
                  <Cards
                    preview
                    cvc={metodo.cvv}
                    name={metodo.name}
                    number={metodo.cardNumber.replace(/\d{12}/g, '*'.repeat(12))}
                    // expiry={metodo.mes + '/' + metodo.ano}
                    issuer={metodo.provider.toLowerCase()}
                  />
              </div>
            ))
          )}
          </div>
          <div className=''>
            <LastPayments/>
          </div>
        </div>
    </div>
  );
}

export default Home;