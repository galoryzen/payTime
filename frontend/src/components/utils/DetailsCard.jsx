import React from 'react'

export default function DetailsCard(props) {
    return (

    <div class="mt-16 mx-auto w-8/12 text-center bg-white rounded-lg border shadow-md sm:p-8 dark:bg-sky-800 dark:border-cyan-900">
    <h5 class="mb-2 text-4xl text-left font-bold text-gray-900 dark:text-white">
        Resumen de la transacción
    </h5>
    <table class="table-fixed w-full">
        <tbody>
            <tr>
                <td>
                    <h5 class="mb-2 text-2xl text-left font-bold text-gray-900 dark:text-white">
                        Referencia
                    </h5>
                </td>
                <td>
                    <h5 class="mb-2 text-2xl text-center text-gray-900 dark:text-white">
                        {props.referencia}
                    </h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h5 class="mb-2 text-2xl text-left font-bold text-gray-900 dark:text-white">
                        Concepto
                    </h5>
                </td>
                <td>
                    <h5 class="mb-2 text-2xl text-center text-gray-900 dark:text-white">
                        {props.concepto}
                    </h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h5 class="mb-2 text-2xl text-left font-bold text-gray-900 dark:text-white">
                        Total a pagar
                    </h5>
                </td>
                <td>
                    <h5 class="mb-2 text-2xl text-center text-gray-900 dark:text-white">
                        {props.cantidad}
                    </h5>
                </td>
            </tr>
            <tr>
                <td>
                    <h5 class="mb-2 text-2xl text-left font-bold text-gray-900 dark:text-white">
                        Fecha
                    </h5>
                </td>
                <td>
                    <h5 class="mb-2 text-2xl text-center text-gray-900 dark:text-white">
                        {props.fecha}
                    </h5>
                </td>
            </tr>
        </tbody>
    </table>
</div>
  )
}
