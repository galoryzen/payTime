import React from 'react';
import NavBar from '../utils/NavBar.jsx';
import PaymentMethod from '../utils/DetailsCard.jsx';
import useFetchCards from '../../hooks/useFetchCards';
import ReactLoading from 'react-loading';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import useToken from '../../hooks/useToken.js';
import { useLocation, useNavigate } from 'react-router-dom';

function Transfer() {
  const { cards, loading } = useFetchCards();
  const nav = useNavigate();
  const [selectedCard, setSelectedCard] = React.useState(null);

  const location = useLocation();
  const data = location.state.data;

  const { token } = useToken();

  const handlePayment = () => {
    const card = cards[selectedCard];
    console.log(card);
    Swal.fire({
      background: '#0C4A6E',
      color: '#fff',
      confirmButtonColor: '#FBBF24',
      title: 'Confirmar pago',
      text: `¿Estás seguro de realizar el pago de $${data.monto} a ${
        data.nombre
      } usando la tarjeta terminada en ${card.cardNumber.slice(12)}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            'http://localhost:3000/transaction',
            {
              amount: data.monto,
              description: data.concepto,
              paymentMethodId: card.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status !== 200) {
              if (res.status === 503)
                throw new Error(
                  'Algo ocurrió en el servidor, su transacción no pudo ser procesada en este momento, pero será procesada en breve. Por favor, manténgase atento a su estado de cuenta'
                );

              if (res.status === 500)
                throw new Error('Error interno del servidor, intente más tarde');

              throw new Error('Algo sucedió, lo sentimos, intente más tarde');
            }

            Swal.fire({
              background: '#0C4A6E',
              color: '#fff',
              confirmButtonColor: '#FBBF24',
              title: 'Pago realizado',
              text: 'Su pago ha sido realizado con éxito!',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              nav('/home');
            });
          })
          .catch((err) => {
            Swal.fire({
              background: '#0C4A6E',
              color: '#fff',
              confirmButtonColor: '#FBBF24',
              title: 'Error',
              text: err.message,
              icon: 'error',
            });
          });
      }
    });
  };

  const handleConsult = () => {
    const card = cards[selectedCard];
    console.log(card);
    Swal.fire({
      background: '#0C4A6E',
      color: '#fff',
      confirmButtonColor: '#FBBF24',
      title: 'Consulta de saldo',
      didOpen: () => {
        Swal.showLoading();
        axios
          .get(`http://localhost:3000/saldo/${card.id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status !== 200) {
              throw new Error('Error al consultar el saldo');
            }
            Swal.fire({
              background: '#0C4A6E',
              color: '#fff',
              confirmButtonColor: '#FBBF24',
              title: 'Saldo',
              text: `Saldo: ${res.data.saldo}`,
              icon: 'success',
            });
          })
          .catch((err) => {
            Swal.fire({
              background: '#0C4A6E',
              color: '#fff',
              confirmButtonColor: '#FBBF24',
              title: 'Error',
              text: 'Hubo un error al consultar el saldo, por favor intente más tarde',
              icon: 'error',
            });
          });
      },
    });
  };

  return (
    <div className='min-h-screen bg-sky-900'>
      <NavBar />
      <div className='justify-center'>
        <PaymentMethod />
      </div>
      <h1 className=' mt-16 flex mx-auto text-2xl font-semibold text-white justify-center'>
        Selecciona un método de pago
      </h1>
      <div className='mt-2 mx-auto scrollbar-thin scrollbar-thumb-rounded-lg  scrollbar-thumb-black/30 max-w-3xl flex bg-black/20 rounded-lg px-6 py-10 w-full overflow-y-visible overflow-x-auto'>
        {loading ? (
          <div className='w-full h-[182.859px] flex justify-center items-center'>
            <ReactLoading type='bubbles' color='white' height={100} width={100} />
          </div>
        ) : (
          cards.map((metodo, idx) => (
            <div
              className={
                idx == selectedCard
                  ? 'select-none w-full -ml-14 mr-14 first:ml-0 transform translate-x-2 -translate-y-6 -rotate-6 transition-all duration-300 ease-in-out'
                  : 'select-none w-full -ml-14 first:ml-0 transform'
              }
              key={idx}
              onClick={() => setSelectedCard(idx)}
            >
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

      <div className='flex items-center justify-center mt-4 gap-6'>
        <button
          className='w-fit bg-sky-800 disabled:bg-gray-800/70 disabled:text-white/50 h-fit text-white text-2xl px-5 py-3 rounded-lg font-medium enabled:hover:bg-sky-600 transition-all ease-in-out duration-300'
          disabled={selectedCard == null}
          onClick={handleConsult}
        >
          <i className='fa-solid fa-magnifying-glass-dollar mr-2'></i>
          Consultar Saldo
        </button>
        <button
          className=' w-fit bg-yellow-500 text-sky-800 disabled:bg-gray-800/70 disabled:text-white/50 h-fit text-2xl px-5 py-3 rounded-lg font-medium enabled:hover:bg-sky-600 enabled:hover:text-white transition-all ease-in-out duration-300'
          disabled={selectedCard == null}
          onClick={handlePayment}
        >
          <i className='fa-solid fa-dollar-sign mr-2'></i>
          Pagar
        </button>
      </div>
    </div>
  );
}

export default Transfer;
