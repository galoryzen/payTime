import React from "react";
import { Link } from 'react-router-dom'

const createPayment = () => {
    return (
            <form class="mt-16 mx-auto w-8/12 text-center bg-white rounded-lg border shadow-md sm:p-8 dark:bg-sky-800 dark:border-cyan-900">
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-white text-xs font-bold mb-2" for="grid-first-name">
                        Nombre Completo
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" name="nombre" id="nombre" placeholder="Nombre Completo"/>
                    </div>
                    <div class="w-full md:w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-white text-xs font-bold mb-2" for="grid-last-name">
                        Correo electrónico
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="email" name="email" id="email" placeholder="Correo Electrónico"/>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-white text-xs font-bold mb-2" for="grid-password">
                        Concepto de pago
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" name="concepto" id="concepto" placeholder="Concepto de pago"/>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-white text-xs font-bold mb-2" for="grid-city">
                        Monto a pagar
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-monto" type="number" min="0" placeholder="$"/>
                    </div>
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-white text-xs font-bold mb-2" for="grid-zip">
                        Número de cuotas
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-cuotas" type="number" min="0" placeholder="0-48"/>
                    </div>
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-white text-xs font-bold mb-2" for="grid-state">
                        Sede
                    </label>
                    <div class="relative">
                        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                        <option>Barranquilla</option>
                        <option>Cartagena</option>
                        <option>Santa Marta</option>
                        <option>Sincelejo</option>
                        <option>Montería</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    </div>
                    <Link to='/payout' className='text-center text-orange-700 font-bold'>Next</Link>
                    <button className='w-full my-5 py-2 bg-amber-500 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/40 text-white font-semibold rounded-lg'>Login</button>
                </div>
            </form>
    );
}

export default createPayment;