import React from 'react';
import { useLocation } from 'react-router-dom';

export default function DetailsCard() {
  const location = useLocation();
  const data = location.state.data;

  const formatPaymentAmount = (amount) => {
    return `$ ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
  };

  return (
    <div class='mt-16 mx-auto w-8/12 text-center bg-white rounded-lg border shadow-md sm:p-8 dark:bg-sky-800 dark:border-cyan-900'>
      <h5 class='mb-2 text-4xl text-left font-bold text-gray-900 dark:text-white'>
        Resumen de la transacción
      </h5>
      <table class='table-fixed w-full'>
        <tbody>
          <tr>
            <td>
              <h5 class='mb-2 text-2xl text-left font-bold text-gray-900 dark:text-white'>
                Nombre Completo
              </h5>
            </td>
            <td>
              <h5 class='mb-2 text-2xl text-center text-gray-900 dark:text-white'>{data.nombre}</h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5 class='mb-2 text-2xl text-left font-bold text-gray-900 dark:text-white'>
                Concepto
              </h5>
            </td>
            <td>
              <h5 class='mb-2 text-2xl text-center text-gray-900 dark:text-white'>
                {data.concepto}
              </h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5 class='mb-2 text-2xl text-left font-bold text-gray-900 dark:text-white'>
                Total a pagar
              </h5>
            </td>
            <td>
              <h5 class='mb-2 text-2xl text-center text-gray-900 dark:text-white'>
                {formatPaymentAmount(data.monto)}
              </h5>
            </td>
          </tr>
          <tr>
            <td>
              <h5 class='mb-2 text-2xl text-left font-bold text-gray-900 dark:text-white'>Sede</h5>
            </td>
            <td>
              <h5 class='mb-2 text-2xl text-center text-gray-900 dark:text-white'>
                {data.location}
              </h5>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
