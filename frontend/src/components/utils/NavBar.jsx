
import logo from '../../assets/Logo.png'
import { Link } from 'react-router-dom'


export default function NavBar() {
    return (
        <div className='relative bg-sky-800'>
            <div className="mx-auto max-w-full px-4 sm:px-6">
                <div className="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                    <Link to='/home'>
                        <span className="sr-only">PayTime</span>
                        <img className='h-8 w-auto sm:h-12' src={logo} alt="logo"/>
                    </Link>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <span className="sr-only">Open menu</span>
                    </div>
        
                    <Link to='/home'>
                        <label className="text-base font-medium text-white hover:text-amber-400">Inicio</label>
                    </Link>
                    <Link to='/pay'>
                        <label className="text-base font-medium text-white hover:text-amber-400">Realizar Pago</label>
                    </Link>
                    <Link to='/search'>
                        <label className="text-base font-medium text-white hover:text-amber-400">Consultar Transacciones</label>
                    </Link>
                    <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                    <Link to='/'>
                        <button className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-amber-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-amber-600">
                            Cerrar Sesión
                        </button>
                    </Link>
                    </div>
                </div>
            </div>
        </div>
        
    )
  }