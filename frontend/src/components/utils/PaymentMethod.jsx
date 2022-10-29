import React from 'react'

export default function PaymentMethod() {
  return (
    <div className='mx-auto'>
        <fieldset>
            <legend class="sr-only">paymentmethod</legend>
            <div class="items-center">    
                <div class="space-y-8 xl:mt-12">
                    <div class="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border cursor-pointer rounded-xl dark:bg-sky-800 dark:border-cyan-900">
                        <div class="flex items-center">
                            <input id="pay-method-1" type="radio" name="paymentmethod" value="1" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"/>
                                <div> 
                                    <div class="flex flex-col items-center mx-5 space-y-1 ">
                                    <h2 class="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">Método de pago X</h2>
                                    <div class="px-2 text-xs text-white-500 bg-gray-100 rounded-full sm:px-4 sm:py-1 dark:bg-sky-700 dark:border-cyan-800 ">
                                        Consultar Saldo
                                    </div>
                                </div>
                            </div>
                            <h2 class="text-2xl font-semibold text-gray-500 sm:text-4xl dark:text-gray-300">**** **** **** 1234</h2>
                        </div>
                    </div>
                    <div class="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border cursor-pointer rounded-xl dark:bg-sky-800 dark:border-cyan-900">
                        <div class="flex items-center">
                            <input id="pay-method-1" type="radio" name="paymentmethod" value="1" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"/>
                                <div> 
                                    <div class="flex flex-col items-center mx-5 space-y-1 ">
                                    <h2 class="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">Método de pago X</h2>
                                    <div class="px-2 text-xs text-white-500 bg-gray-100 rounded-full sm:px-4 sm:py-1 dark:bg-sky-700 dark:border-cyan-800 ">
                                        Consultar Saldo
                                    </div>
                                </div>
                            </div>
                            <h2 class="text-2xl font-semibold text-gray-500 sm:text-4xl dark:text-gray-300">**** **** **** 1234</h2>
                        </div>
                    </div>

                    <div class="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border cursor-pointer rounded-xl dark:bg-sky-800 dark:border-cyan-900">
                        <div class="flex items-center">
                            <input id="pay-method-1" type="radio" name="paymentmethod" value="1" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"/>
                                <div> 
                                    <div class="flex flex-col items-center mx-5 space-y-1 ">
                                    <h2 class="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">Método de pago X</h2>
                                    <div class="px-2 text-xs text-white-500 bg-gray-100 rounded-full sm:px-4 sm:py-1 dark:bg-sky-700 dark:border-cyan-800 ">
                                        Consultar Saldo
                                    </div>
                                </div>
                            </div>
                            <h2 class="text-2xl font-semibold text-gray-500 sm:text-4xl dark:text-gray-300">**** **** **** 1234</h2>
                        </div>
                    </div>
                    <button class="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border cursor-pointer rounded-xl bg-white dark:border-cyan-900">
                        <h2 class="text-lg font-medium text-cyan-700 sm:text-2xl">Pagar</h2>
                    </button>
                </div>
            </div>
        </fieldset>
    </div>

  )
}
