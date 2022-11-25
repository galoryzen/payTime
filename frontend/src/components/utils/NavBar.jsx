import logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';

//function to logout
const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  window.location.replace('http://localhost:3001/');
};

export default function NavBar() {
  return (
    <div className='relative bg-sky-800'>
      <div className='mx-auto max-w-full px-4 sm:px-6'>
        <div className='flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10'>
          <div className='flex justify-start lg:w-0 lg:flex-1'>
            <Link to='/home'>
              <span className='sr-only'>PayTime</span>
              <img className='h-8 w-auto sm:h-12' src={logo} alt='logo' />
            </Link>
          </div>
          <div className='-my-2 -mr-2 md:hidden'>
            <span className='sr-only'>Open menu</span>
          </div>

          <Link to='/home'>
            <label className='text-base cursor-pointer font-medium text-white hover:text-amber-400'>
              Inicio
            </label>
          </Link>
          <Link to='/pay'>
            <label className='text-base cursor-pointer font-medium text-white hover:text-amber-400'>
              <i className='fa-solid mr-2 fa-money-check-dollar'></i>Realizar Pago
            </label>
          </Link>
          <Link to='/search'>
            <label className='text-base cursor-pointer font-medium text-white hover:text-amber-400'>
              <i className='fa-solid fa-magnifying-glass mr-2'></i>Consultar Transacciones
            </label>
          </Link>
          <Link to='/payment-methods'>
            <label className='text-base cursor-pointer bg-amber-400 rounded-lg px-4 py-2 font-semibold text-sky-800 hover:text-white hover:bg-sky-600 transition-all duration-150'>
              <i className='fa-regular fa-credit-card mr-2'></i>
              Métodos de pago
            </label>
          </Link>
          <div className='hidden items-center justify-end md:flex md:flex-1 lg:w-0'>
            <button
              type='button'
              className='cursor-pointer bg-amber-400 rounded-lg px-4 py-2 font-semibold text-sky-800 hover:text-white hover:bg-sky-600 transition-all duration-150'
              onClick={logout}
            >
              <i className='fa-solid fa-sign-out mr-2'></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
