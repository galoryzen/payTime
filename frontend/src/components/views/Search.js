import React, { useEffect, useState } from 'react'
import NavBar from '../utils/NavBar.jsx';
import Transactions from '../utils/Transactions.jsx';
import Swal from 'sweetalert2';
import useToken from '../../hooks/useToken';
import axios from 'axios';

function Search() {

  const { token } = useToken();
  const [transactions, setTransactions] = useState([]);

  const transactionTest = [{id: 1, concepto: "test", monto: 100, fecha: "2021-01-01", sede: "Montería", estado: "test"},
  {id: 2, concepto: "test", monto: 100, fecha: "2021-01-01", sede: "Montería", estado: "test"},
  {id: 3, concepto: "test", monto: 100, fecha: "2021-01-01", sede: "Montería", estado: "test"},
  {id: 4, concepto: "test", monto: 100, fecha: "2021-01-01", sede: "Montería", estado: "test"},
  {id: 5, concepto: "test", monto: 100, fecha: "2021-01-01", sede: "Montería", estado: "test"},
];


  useEffect(() => {
    axios.get('http://localhost:3000/transaction/user/1',{
      withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
    }).then(response => {
      console.log(response.data);
      if (response.data.success) {
        setTransactions(response.data);
      }
    })
      .catch(err => {
        Swal.fire({
          background: '#0C4A6E',
          color: '#fff',
          confirmButtonColor: '#FBBF24',
          icon: 'error',
          title: 'Servicio no disponible',
          text: err,
      });
      })
  }, [])

  return (
    <div className='min-h-screen bg-sky-900 hide-scrollbar'>
        <NavBar/>
        <div className='overflow-scroll h-screen'>
          {transactions.map((transaction, index) => {
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