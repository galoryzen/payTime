import React from 'react';
import NavBar from '../utils/NavBar';
import 'react-credit-cards/es/styles-compiled.css';
import Cards from 'react-credit-cards';
import ReturnButton from '../utils/ReturnButton';
import { useParams, useNavigate } from 'react-router-dom';
import useFetchCard from '../../hooks/useFetchCard';
import ReactLoading from 'react-loading';
import Dialog from '../utils/Dialog';
import axios from 'axios';
import useToken from '../../hooks/useToken';
import Swal from 'sweetalert2';

export default function PaymentMethodDetail() {
  const icon = {
    mastercard: 'https://img.icons8.com/color/512/mastercard.png',
    visa: 'https://img.icons8.com/color/512/visa.png',
    amex: 'https://img.icons8.com/color/512/amex.png',
  };

  const formatBalance = (balance) => {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const { token } = useToken();
  const [view, setView] = React.useState(false);
  const params = useParams();
  const id = params.payment_method_id;
  const { card, loading } = useFetchCard(id);
  const navigate = useNavigate();

  const showDeleteDialog = () => {
    Swal.fire({
      title: `Está seguro que desea eliminar la tarjeta terminada en ${card.cardNumber.slice(12)}?`,
      text: 'Una vez eliminada la tarjeta, no podrá recuperarla',
      icon: 'warning',
      showCancelButton: true,
      background: '#0C4A6E',
      color: '#fff',
      confirmButtonColor: '#FBBF24',
      confirmButtonText: 'Si, borrala!',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return axios
          .delete(`http://localhost:3000/paymentMethod/${id}`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.status !== 200) {
              throw new Error(response.statusText);
            }
          })
          .catch((error) => {
            Swal.showValidationMessage(
              `Algo salió mal! Lo sentimos mucho, por favor intente más tarde`
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Tarjeta eliminada!',
          icon: 'success',
          background: '#0C4A6E',
          color: '#fff',
          confirmButtonColor: '#FBBF24',
        });
        navigate('/payment-methods');
      }
    });
  };

  const toggleVisibility = (value) => {
    if (card.balance === -1) {
      Swal.fire({
        title: 'Algo salió mal!',
        text: 'No pudimos obtener el saldo de tu tarjeta, o este no se encuentra disponible por el momento',
        icon: 'error',
        background: '#0C4A6E',
        color: '#fff',
        confirmButtonColor: '#FBBF24',
      });
    }
    setView(value);
  };

  const showBalance = () => {
    if (card.balance === -1) {
      return ' NO DISPONIBLE';
    } else {
      return formatBalance(card.balance);
    }
  };

  return (
    <div className='min-h-screen bg-sky-900'>
      <NavBar />

      <div className='w-full flex justify-center'>
        <div className='max-w-3xl w-full mt-10'>
          <ReturnButton />
        </div>
      </div>
      <div className=' flex items-center flex-col  self-center'>
        <div className='mt-6 flex-col  justify-center  max-w-3xl flex bg-black/20 rounded-lg px-6 py-10 w-full'>
          <div className='w-[95%] flex justify-between items-center border-b-2 pb-4 px-4 border-black/25'>
            <h1 className='text-2xl font-semibold text-white'>
              Detalles
              <button
                className='ml-4 font-medium h-10 w-10 bg-black/20 hover:bg-black/40 transition-all duration-150 ease-in-out rounded-full text-base'
                onClick={() => toggleVisibility(!view)}
              >
                {view ? <i class='fa-solid fa-eye-slash'></i> : <i class='fa-solid fa-eye'></i>}
              </button>
              <button
                className='ml-4 font-medium hover:bg-red-700 duration-200 ease-in-out transition-all bg-red-500 group w-fit px-4 py-2 rounded-full text-base'
                onClick={showDeleteDialog}
              >
                <i class='fa-solid fa-trash'></i> Eliminar medio de pago
              </button>
            </h1>
            {loading ? (
              <div>xd</div>
            ) : (
              <img class='w-14 h-14' src={icon[card.provider.toLowerCase()]} alt='Logo' />
            )}
          </div>
          <div className='flex gap-2 mt-6 w-full items-center select-none'>
            <div className='w-1/2 flex flex-col justify-between h-full items-center'>
              {loading ? (
                <Cards number='' name=''></Cards>
              ) : (
                <Cards
                  name={card.name}
                  number={
                    view ? card.cardNumber : card.cardNumber.replace(/\d{12}/g, '*'.repeat(12))
                  }
                  preview={!view}
                  issuer={card.provider}
                />
              )}
              <div className='w-[290px]  text-white'>
                <div className='flex flex-col w-fit mt-3'>
                  <span className='text-base'>Balance:</span>
                  <span className='text-3xl font-semibold'>${view ? showBalance() : ' ***'}</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col w-1/2 mr-10 gap-2'>
              {loading ? (
                <div className='flex justify-center items-center h-[296px] '>
                  <ReactLoading type='bubbles' color='white' height={200} width={200} />
                </div>
              ) : (
                <div className='w-full px-6 py-6 text-white select-none flex flex-col justify-center gap-2 h-fit'>
                  <div className='flex flex-col'>
                    <label htmlFor='nombreTarjeta' className='font-light'>
                      Nombre en la tarjeta
                    </label>
                    <input
                      type='text'
                      id='nombreTarjeta'
                      className='input select-none'
                      value={card.name}
                      readOnly
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor='numeroCuenta' className='font-light'>
                      Número de Cuenta
                    </label>
                    <input
                      maxLength={16}
                      type='text'
                      id='numeroCuenta'
                      className='input'
                      value={
                        view ? card.cardNumber : card.cardNumber.replace(/\d{12}/g, '*'.repeat(12))
                      }
                      readOnly
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor='banco' className='font-light'>
                      Banco
                    </label>
                    <input type='text' id='banco' className='input' defaultValue='East Bank' />
                  </div>
                  <div className='flex w-fit px-4 py-2 rounded-full bg-black/30 items-center mt-4'>
                    <div className='w-4 h-4 rounded-full bg-red-500 mr-2'></div>
                    <span>Desactivada</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
