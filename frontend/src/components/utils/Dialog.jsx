import React from 'react';
import { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';

const Dialog = ({
  visible = false,
  setVisible = () => {},
  type = 'alert',
  children,
  onCancel = () => {},
  onClose = () => {},
  onConfirm = () => {},
  options = {},
  loading = false,
}) => {
  const handleClose = () => {
    onClose();
    setVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    setVisible(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setVisible(false);
  };

  const dialogOptions = {
    alert: {
      title: 'Alerta',
      icon: 'fa-solid fa-triangle-exclamation',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      showCancel: false,
      showConfirm: true,
      ...options,
    },
    confirm: {
      title: 'Confirmar accion',
      icon: 'fa-solid fa-question',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      showCancel: true,
      showConfirm: true,
      ...options,
    },
    success: {
      title: 'Éxito',
      icon: 'fa-solid fa-check-circle',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      showCancel: false,
      showConfirm: true,
      ...options,
    },
  };

  const [optionsSet, setOptionsSet] = useState(dialogOptions[type]);

  useEffect(() => {
    setOptionsSet(dialogOptions[type]);
  }, [type]);

  return (
    <div
      className={` ${visible ? 'show' : ''} popup bg-black/70  w-screen absolute z-[49]`}
    >
      <div className='flex flex-col items-center justify-between p-3 w-96 h-56 absolute bg-sky-900 border-4 border-sky-800  rounded-lg inset-0 m-auto z-50'>
        <div className='w-full flex flex-row justify-end'>
          <button
            onClick={handleClose}
            className='h-6 w-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center'
          >
            <i className='text-white text-md fa-solid fa-xmark'></i>
          </button>
        </div>
        <div className='flex w-full font-medium justify-center align-items-center text-white text-3xl'>
          {optionsSet.title}
        </div>
        {loading ? (
          <ReactLoading type='bubbles' color='white' height={100} width={100} />
        ) : (
          <>
            <div className='flex flex-row w-full justify-center items-center'>
              <div className='w-[95%] flex'>
                <i className={`${optionsSet.icon} text-5xl text-white`}></i>
                <div className=' text-white text-center'>{children}</div>
              </div>
            </div>
            <div className='flex items-center mb-2 justify-center'>
              {optionsSet.showCancel && (
                <button
                  onClick={handleCancel}
                  className='ml-4 bg-black/60 hover:bg-black/80 transition-all ease-in-out duration-200 px-4 py-2 flex items-center justify-center rounded-lg text-white'
                >
                  <i class='fa-solid fa-xmark mr-2'></i> {optionsSet.cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className='ml-4 bg-black/60 hover:bg-black/80 transition-all ease-in-out duration-200 px-4 py-2 flex items-center justify-center rounded-lg text-white'
              >
                <i class='fa-solid fa-check mr-2'></i> {optionsSet.confirmText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dialog;
