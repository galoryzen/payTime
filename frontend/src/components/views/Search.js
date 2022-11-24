import React, { useEffect, useState } from 'react'
import NavBar from '../utils/NavBar.jsx';
import Transactions from '../utils/Transactions.jsx';
import useFetchTransactions from '../../hooks/useFetchTransactions';
import Swal from 'sweetalert2';
import useToken from '../../hooks/useToken';
import axios from 'axios';

function Search() {

  const { transactions: transacciones } = useFetchTransactions();

  return (
    <div className='min-h-screen bg-sky-900 hide-scrollbar'>
        <NavBar/>
        <div className='overflow-scroll h-screen'>
          {transacciones.map((transaction, index) => {
            return <Transactions key={index} 
            id={transaction.id} concepto={transaction.description} 
            monto={transaction.amount} fecha={transaction.createdAt} 
            sede={"transaction.sede"} estado={transaction.status}/>
          })}
        </div>
    </div>
  )
}

export default Search