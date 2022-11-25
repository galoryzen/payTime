import React from 'react'

export default function lastPayments({concepto, fecha, monto, estado}) {
    function Estado(estado){
        if (estado === 'Approved'){
            return <h5 class="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-green-500">{estado}</h5>
        }else{
            return <h5 class="mb-2 text-2xl text-center font-bold text-gray-900 dark:text-red-500">{estado}</h5>
        }
    }
  return (
            <div class="flex flex-wrap -m-4">
                <div class={`p-4 sm:w-1/2 lg:w-1/3`}>
                    <div class="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                        <div class="p-6 hover:bg-sky-700 hover:text-white transition duration-300 ease-in">
                            <h2 class="text-2xl font-medium text-amber-400 mb-1">{concepto}</h2>
                            <h1 class="text-2xl font-semibold mb-3">{fecha}</h1>
                            <h1 class="text-4xl font-semibold mb-3">{monto}</h1>
                            <h2 class="text-2xl font-medium mb-1">{Estado(estado)}</h2>
                        </div>
                    </div>
                </div>
            </div>
  )
}