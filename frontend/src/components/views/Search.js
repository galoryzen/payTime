import React, { useEffect, useState } from 'react'
import NavBar from '../utils/NavBar.jsx';
import Transactions from '../utils/Transactions.jsx';
import useFetchTransactions from '../../hooks/useFetchTransactions';
import Swal from 'sweetalert2';

function Search() {

  const { transactions: transacciones, error: err } = useFetchTransactions();

  const formatPaymentAmount = (amount) => {
    return `$ ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
  };

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
    <div className='min-h-screen bg-sky-900 hide-scrollbar'>
        <NavBar/>
        <div className='overflow-scroll h-screen'>
          {
            //if transacciones is not empty map it
            transacciones.length > 0 ? transacciones.map((transaction, index) => {
              return (
                <Transactions key={index}
                id={transaction.id}
                concepto={transaction.description} 
                monto={formatPaymentAmount(transaction.amount)} 
                fecha={new Date(transaction.createdAt).toLocaleDateString()}
                sede={transaction.place} 
                estado={transaction.status}/>
              )
            })
            :
            <div className='flex flex-col items-center justify-center h-screen'>
              <h1 className='text-2xl text-white'>No hay transacciones</h1>
            </div>
          }
        </div>
    </div>
  )
}

export default Search