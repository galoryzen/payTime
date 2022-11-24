import React from 'react';
import NavBar from '../utils/NavBar';
import Select from 'react-select';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { Link } from 'react-router-dom';
import useFetchCards from '../../hooks/useFetchCards';
import ReactLoading from 'react-loading';
import axios from 'axios';
import useToken from '../../hooks/useToken';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function PaymentMethod() {
  const options = [
    { value: 1, label: 'West Bank' },
    { value: 2, label: 'East Bank' },
  ];
  const cardTypes = [
    { value: 'CREDITO', label: 'Crédito' },
    { value: 'DEBITO', label: 'Débito' },
  ];

  const stylesSelect = {
    container: (styles) => ({
      ...styles,
      marginTop: '0 !important',
      marginLeft: '1px !important',
      marginRight: '2px !important',
      marginBottom: '0 !important',
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: '#276888 !important',
      borderRadius: '25px !important',
      borderColor: 'transparent !important',
      outline: 'none !important',
      boxShadow: 'none !important',
      '&:hover': {
        borderColor: 'transparent !important',
        boxShadow: 'none !important',
      },
      '&:focus': {
        borderColor: 'transparent !important',
        boxShadow: 'none !important',
      },
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: '#219EBCff !important',
    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'black',
    }),
    menuList: (styles) => ({
      ...styles,
      color: 'black',
      backgroundColor: '#276888',
      boxShadow: '-1px 10px 30px -10px rgba(0,0,0,0.15)',
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: '#EE712D',
    }),
    option: (styles) => ({
      ...styles,
      color: 'white',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: '#0c4a6e',
      },
    }),
    indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const [focus, setFocus] = React.useState('');
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('');
  const [bank, setBank] = React.useState(0);
  const [numTarjeta, setNumTarjeta] = React.useState('');
  const [mesVencimiento, setMesVencimiento] = React.useState('');
  const [anoVencimiento, setAnoVencimiento] = React.useState('');
  const [cvv, setCvv] = React.useState('');

  const formatCardNumber = (value) => {
    return value;
  };

  const { cards: metodosPago, loading } = useFetchCards();
  const { token } = useToken();
  const reload = () => {
    window.location.reload();
  };

  const requestCreateCard = async () => {
    const card = {
      name: name,
      tipo: type,
      cardNumber: numTarjeta.replace(/\s/g, ''),
      CVV: cvv,
      expiryDate: `20${anoVencimiento}-${mesVencimiento}-28`,
      bankId: bank,
    };
    console.log(card);
    axios
      .post('http://localhost:3000/paymentMethod', card, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .then(() => {
        reload();
      })
      .catch((err) => {});
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    // Validate if card name is not empty
    if (name === '') {
      Swal.fire({
        background: '#0C4A6E',
        color: '#fff',
        confirmButtonColor: '#FBBF24',
        icon: 'error',
        title: 'Oops...',
        text: 'El nombre de la tarjeta no puede estar vacío',
      });
      return;
    }

    if (numTarjeta === '' || numTarjeta.length < 14) {
      Swal.fire({
        background: '#0C4A6E',
        color: '#fff',
        confirmButtonColor: '#FBBF24',
        icon: 'error',
        title: 'Oops...',
        text: 'El numero de la tarjeta no puede estar vacío',
      });
      return;
    }

    if (bank === 0) {
      Swal.fire({
        background: '#0C4A6E',
        color: '#fff',
        confirmButtonColor: '#FBBF24',
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar un banco',
      });
      return;
    }

    if (type === '') {
      Swal.fire({
        background: '#0C4A6E',
        color: '#fff',
        confirmButtonColor: '#FBBF24',
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar un tipo de tarjeta',
      });
      return;
    }

    if (cvv === '' || cvv.length < 3) {
      Swal.fire({
        background: '#0C4A6E',
        color: '#fff',
        confirmButtonColor: '#FBBF24',
        icon: 'error',
        title: 'Oops...',
        text: 'El CVV de la tarjeta no puede estar vacío',
      });
      return;
    }

    if (mesVencimiento === '' || mesVencimiento.length < 2 || mesVencimiento > 12) {
      Swal.fire({
        background: '#0C4A6E',
        color: '#fff',
        confirmButtonColor: '#FBBF24',
        icon: 'error',
        title: 'Oops...',
        text: 'El mes de vencimiento de la tarjeta no puede estar vacío',
      });
      return;
    }

    if (anoVencimiento === '' || anoVencimiento.length < 2 || anoVencimiento < 22) {
      Swal.fire({
        background: '#0C4A6E',
        color: '#fff',
        confirmButtonColor: '#FBBF24',
        icon: 'error',
        title: 'Oops...',
        text: 'El año de vencimiento de la tarjeta no puede estar vacío',
      });
      return;
    }
    Swal.fire({
      background: '#0C4A6E',
      color: '#fff',
      confirmButtonColor: '#FBBF24',
      icon: 'question',
      title: 'Confirme creación de su tarjeta',
      text: `¿Está seguro que desea crear esta tarjeta terminada en ${numTarjeta.slice(12)}?`,
      showLoaderOnConfirm: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        const card = {
          name: name,
          tipo: type,
          cardNumber: numTarjeta.replace(/\s/g, ''),
          CVV: cvv,
          expiryDate: `20${anoVencimiento}-${mesVencimiento}-28`,
          bankId: bank,
        };
        return axios
          .post('http://localhost:3000/paymentMethod', card, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status !== 200) {
              throw new Error(res.message);
            }
            return res;
          })
          .catch((err) => {
            Swal.showValidationMessage(`Algo salió mal! Por favor intente más tarde`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          background: '#0C4A6E',
          color: '#fff',
          confirmButtonColor: '#FBBF24',
          icon: 'success',
          title: 'Tarjeta creada',
          text: 'Su tarjeta ha sido creada exitosamente',
        }).then(() => {});
      } else {
        Swal.fire({
          background: '#0C4A6E',
          color: '#fff',
          confirmButtonColor: '#FBBF24',
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear su tarjeta',
        });
      }
    });
  };

  return (
    <div className='h-screen bg-sky-900 overflow-hidden'>
      <NavBar />
      <div className=' flex items-center flex-col  self-center'>
        <span className='mt-10 text-2xl font-semibold text-white mb-4'>
          ¿Deseas agregar un nuevo método de pago?
        </span>
        <div className='max-w-3xl px-6 mb-10 bg-black/20 rounded-lg py-6 w-full gap-x-4 flex justify-between'>
          <div className='flex flex-col items-end gap-2 justify-center select-none'>
            <Cards
              cvc={cvv}
              name={name}
              number={numTarjeta}
              expiry={mesVencimiento + '/' + anoVencimiento}
              focused={focus}
              acceptedCards={['mastercard', 'visa', 'amex']}
              placeholders={{
                name: 'NOMBRE APELLIDO',
              }}
              locale={{ valid: 'Válido hasta' }}
            />
            <button
              className='w-fit mt-4 bg-sky-800 h-fit text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 transition-all ease-in-out duration-150'
              onClick={handleCreateCard}
            >
              Agregar tarjeta
            </button>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <div className='w-96 px-6 py-6 text-white flex flex-col justify-center gap-2 h-[88] bg-[#219EBC26] shadow-lg rounded-3xl'>
              <div className='flex flex-col'>
                <label htmlFor='nombreTarjeta' className='font-light'>
                  Nombre en la tarjeta
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type='text'
                  id='nombreTarjeta'
                  className='input'
                  placeholder='John Doe'
                  onFocus={(e) => setFocus(e.target.name)}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='numeroCuenta' className='font-light'>
                  Número de Cuenta
                </label>
                <input
                  onInput={(e) => {
                    if (e.target.value.length > e.target.maxLength)
                      e.target.value = e.target.value.slice(0, e.target.maxLength);
                  }}
                  maxLength={16}
                  onChange={(e) => setNumTarjeta(formatCardNumber(e.target.value))}
                  type='number'
                  id='numeroCuenta'
                  className='input'
                  placeholder='1111 1111 1111 1111'
                  onFocus={(e) => setFocus(e.target.name)}
                  value={numTarjeta}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='banco' className='font-light'>
                  Banco
                </label>
                <Select
                  id='banco'
                  placeholder='Seleccione un banco'
                  styles={stylesSelect}
                  className='my-react-select-container'
                  classNamePrefix='my-react-select'
                  options={options}
                  onChange={(e) => setBank(e.value)}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='tipoTarjeta' className='font-light'>
                  Tipo de Tarjeta
                </label>
                <Select
                  id='tipoTarjeta'
                  placeholder='Seleccione tipo de Tarjeta'
                  styles={stylesSelect}
                  className='my-react-select-container'
                  classNamePrefix='my-react-select'
                  options={cardTypes}
                  onChange={(e) => setType(e.value)}
                />
              </div>
              <div className='flex gap-x-2 w-[90%] justify-between'>
                <div className='flex flex-col'>
                  <label htmlFor='cvv' className='font-light'>
                    CVV
                  </label>
                  <input
                    onInput={(e) => {
                      if (e.target.value.length > e.target.maxLength)
                        e.target.value = e.target.value.slice(0, e.target.maxLength);
                    }}
                    maxLength={4}
                    onChange={(e) => setCvv(e.target.value)}
                    type='number'
                    id='cvv'
                    className='bg-white/10 rounded-full px-2 py-1 outline-none w-16 text-center'
                    onFocus={(e) => setFocus('cvc')}
                  />
                </div>
                <div className='flex flex-col'>
                  <label className='font-light'>Fecha de Expiración</label>
                  <div className='flex gap-2'>
                    <input
                      maxLength={2}
                      onInput={(e) => {
                        if (e.target.value.length > e.target.maxLength)
                          e.target.value = e.target.value.slice(0, e.target.maxLength);
                      }}
                      onChange={(e) => setMesVencimiento(e.target.value)}
                      type='number'
                      id='month'
                      className='input w-12 text-center'
                      placeholder='MM'
                    />
                    <input
                      maxLength={2}
                      onInput={(e) => {
                        if (e.target.value.length > e.target.maxLength)
                          e.target.value = e.target.value.slice(0, e.target.maxLength);
                      }}
                      onChange={(e) => setAnoVencimiento(e.target.value)}
                      type='number'
                      id='year'
                      className='input w-12 text-center'
                      placeholder='AA'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1 className='text-2xl font-semibold text-white'>Métodos de pago</h1>
        <div className='mt-2 scrollbar-thin scrollbar-thumb-rounded-lg  scrollbar-thumb-black/30 max-w-3xl flex bg-black/20 rounded-lg px-6 py-10 w-full overflow-y-visible overflow-x-auto'>
          {loading ? (
            <div className='w-full h-[182.859px] flex justify-center items-center'>
              <ReactLoading type='bubbles' color='white' height={100} width={100} />
            </div>
          ) : (
            metodosPago.map((metodo, index) => (
              <div className='select-none bg-transparent w-full -ml-14 hover:mr-14 first:ml-0 transform hover:translate-x-2 hover:-translate-y-6 hover:-rotate-6 transition-all duration-300 ease-in-out'>
                <Link to={`/payment-methods/${metodo.id}`} className='-z-40'>
                  <Cards
                    preview
                    cvc={metodo.cvv}
                    name={metodo.name}
                    number={metodo.cardNumber.replace(/\d{12}/g, '*'.repeat(12))}
                    // expiry={metodo.mes + '/' + metodo.ano}
                    issuer={metodo.provider.toLowerCase()}
                  />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
