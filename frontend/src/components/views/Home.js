import React from 'react'
import NavBar from '../utils/NavBar.jsx';
import User from '../utils/User.jsx';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import LastPayments from '../utils/LastPayments.jsx';
import ReactLoading from 'react-loading';
import useFetchTransactions from '../../hooks/useFetchTransactions';
import Swal from 'sweetalert2';
import useFetchUser from '../../hooks/useFetchUser.js';
import useFetchCards from '../../hooks/useFetchCards';

function Home() {

  const { user: user, loading: loadingUser } = useFetchUser();
  const { cards: metodosPago, loading: loadingCards } = useFetchCards();
  const { transactions: transacciones, error: err } = useFetchTransactions();

  localStorage.setItem('user', JSON.stringify(user));

  console.log(err)
  if (err) {
    Swal.fire({
      background: '#0C4A6E',
      color: '#fff',
      confirmButtonColor: '#FBBF24',
      icon: 'error',
      title: 'Servicio no disponible',
      text: 'Por favor intente más tarde',
    });
  }

  return (
    <div className='min-h-screen bg-sky-900'>
      <NavBar />
      <div className=''>
        <div className='flex justify-center items-center py-16 gap-32'>
          {loadingUser ? <ReactLoading type={'spin'} color={'#FBBF24'} height={100} width={100} /> :
            <User nombre={user.name} email={user.email} />}
          {loadingCards ? (
            <div className='w-full h-[182.859px] flex justify-center items-center'>
              <ReactLoading type='bubbles' color='white' height={100} width={100} />
            </div>
          ) : (
            metodosPago.length > 0 ? metodosPago.map((cards, index) => {
              if (index < 2) {
                return (
                  <div className='flex flex-col items-end justify-center select-none '>
                    <Cards
                      key={index}
                      preview
                      cvc={cards.cvv}
                      name={cards.name}
                      number={cards.cardNumber.replace(/\d{12}/g, '*'.repeat(12))}
                      // expiry={metodo.mes + '/' + metodo.ano}
                      issuer={cards.provider.toLowerCase()}
                    />
                  </div>
                )
              }
            })
              :
              <div className='flex flex-col items-end justify-center select-none '>
                <Cards
                  preview
                  key={index}
                  cvc={""}
                  name={""}
                  number={""}
                  // expiry={metodo.mes + '/' + metodo.ano}
                  issuer={""}
                />
              </div>
          )}
        </div>
        <div className=''>
          <section class="flex items-center text-white">
            <div class="container px-5 py-6 mx-auto">
              <div class="text-left mb-12">
                <h1 class="text-2xl md:text-6xl font-semibold">Últimos Pagos</h1>
                <div className='flex row justify-center items-center flex-wrap -m-4'>
                {
                  //if transacciones is not empty map it
                  transacciones.length > 0 ? transacciones.map((transaction, index) => {
                    if (index < 3) {
                      return (
                        <LastPayments key={index}
                          concepto={transaction.description}
                          fecha={new Date(transaction.createdAt).toLocaleDateString()}
                          monto={transaction.amount}
                          estado={transaction.status} />
                      )
                    }
                  })
                    :
                    <div className='flex flex-col items-center justify-center h-1/2 py-36'>
                      <h1 className='text-2xl text-white'>No hay transacciones</h1>
                    </div>
                }
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;