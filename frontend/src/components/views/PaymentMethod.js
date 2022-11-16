import React from 'react';
import NavBar from '../utils/NavBar';
import Select from 'react-select';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

export default function PaymentMethod() {
  const options = [
    { value: 'westBank', label: 'West Bank' },
    { value: 'eastBank', label: 'East Bank' },
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
  const [numTarjeta, setNumTarjeta] = React.useState('');
  const [mesVencimiento, setMesVencimiento] = React.useState('');
  const [anoVencimiento, setAnoVencimiento] = React.useState('');
  const [cvv, setCvv] = React.useState('');

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  return (
    <div className='h-screen bg-sky-900'>
      <NavBar />
      <div className=' flex items-center flex-col  self-center'>
        <div className='w-fit gap-x-4 mt-10 flex '>
          <div className='flex flex-col items-end gap-2 justify-center'>
            <Cards
              cvc={cvv}
              name={name}
              number={numTarjeta}
              expiry={mesVencimiento + '/' + anoVencimiento}
              focused={focus}
              acceptedCards={['mastercard', 'visa', 'amex']}
            />
            <button className='w-fit mt-4 bg-sky-800 h-fit text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 transition-all ease-in-out duration-150'>
              Agregar tarjeta
            </button>
          </div>
          {/* <div class='w-96 h-56 bg-red-100 rounded-xl relative text-white shadow-2xl'>
            <img
              class='relative object-cover w-full h-full rounded-xl'
              src='https://i.imgur.com/kGkSg1v.png'
              alt='Fondo'
            />

            <div class='w-full px-8 absolute top-8'>
              <div class='flex justify-between'>
                <img
                  class='w-14 h-14'
                  src='https://img.icons8.com/color/512/mastercard.png'
                  alt='Logo'
                />
              </div>
              <div class='pt-1'>
                <h1 class='font-light'>Número de Tarjeta</h1>
                <p class='font-medium tracking-more-wider'>
                  {numTarjeta ? numTarjeta : '**** **** **** ****'}
                </p>
              </div>
              <div class='pt-6 pr-6'>
                <div class='flex justify-between'>
                  <div class=''>
                    <h1 class='font-light text-xs'>Válido hasta</h1>
                    <p class='font-medium tracking-wider text-sm'>
                      {mesVencimiento ? mesVencimiento + '/' + anoVencimiento : 'MM/AA'}
                    </p>
                  </div>
                  <div class=''>
                    <h1 class='font-light text-xs'>CVV</h1>
                    <p class='font-bold tracking-more-wider text-sm'>{cvv ? cvv : '***'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className='flex flex-col items-end gap-2'>
            <div className='w-96 px-6 py-6 text-white flex flex-col justify-center gap-2 h-72 bg-[#219EBC26] shadow-lg rounded-3xl'>
              <div className='flex flex-col'>
                <label htmlFor='nombreTarjeta' className='font-light'>
                  Nombre en la tarjeta
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type='text'
                  id='nombreTarjeta'
                  className='bg-white/10 rounded-full px-2 py-1'
                  placeholder='1111 1111 1111 1111'
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
                  className='bg-white/10 rounded-full px-2 py-1'
                  placeholder='1111 1111 1111 1111'
                  onFocus={(e) => setFocus(e.target.name)}
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
                    className='bg-white/10 rounded-full w-16 text-center'
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
                      className='bg-white/10 rounded-full w-12 text-center'
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
                      className='bg-white/10 rounded-full w-12 text-center'
                      placeholder='AA'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
