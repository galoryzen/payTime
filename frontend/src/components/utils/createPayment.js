import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CreatePayment(){
    const navigate = useNavigate();
    const [data, setData] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [event.target.name] : event.target.value });
    };

    const setForm = (event) => {
        event.preventDefault();
        const verificarUser = data.nombre === undefined || data.nombre === ""
        const verificarConcepto = data.concepto === undefined || data.concepto === ""
        const verificarMonto = data.monto === undefined || data.monto === "" || data.monto <= 0
        if (verificarUser || verificarConcepto || verificarMonto) {
            Swal.fire({
                background: '#0C4A6E',
                color: '#fff',
                confirmButtonColor: '#FBBF24',
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, rellene todos los campos correctamente',
            });
            return ;
        }
        data.location = data.location? data.location : "Barranquilla";
        navigate("/transfer",{state:{data:data}})
    }

    return (
            <div>
                <form class="mt-16 mx-auto w-8/12 text-center bg-white rounded-lg border shadow-md sm:p-8 dark:bg-sky-800 dark:border-cyan-900" onSubmit={setForm}>
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-white text-lg font-bold mb-2" for="grid-first-name">
                        Nombre Completo
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" name="nombre" id="nombre" placeholder="Nombre Completo" onChange={handleInputChange}/>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-white text-lg font-bold mb-2" for="grid-password">
                        Concepto de pago
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" name="concepto" id="concepto" placeholder="Concepto de pago" onChange={handleInputChange}/>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-white text-lg font-bold mb-2" for="grid-city">
                        Monto a pagar
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-monto" name="monto" type="number" min="0" placeholder="$" onChange={handleInputChange}/>
                    </div>
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-white text-lg font-bold mb-2" for="grid-state">
                        Sede
                    </label>
                    <div class="relative">
                        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" name="location" onChange={handleInputChange}>
                        <option value="Barranquilla">Barranquilla</option>
                        <option value="Cartagena">Cartagena</option>
                        <option value="Santa Marta">Santa Marta</option>
                        <option value="Sincelejo">Sincelejo</option>
                        <option value="Montería">Montería</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    </div>
                    <button className='w-full my-5 py-2 bg-amber-500 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/40 text-lg text-white font-semibold rounded-lg' type="submit">Hacer pago</button>
                </div>
            </form>
            </div>
    );
}