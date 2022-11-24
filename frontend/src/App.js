import { Routes, Route } from 'react-router-dom';
import Home from './components/views/Home';
import Login from './components/authentication/Login.jsx';
import SignUp from './components/authentication/SignUp.jsx';
import Pay from './components/views/Pay';
import Search from './components/views/Search';
import PaymentMethod from './components/views/PaymentMethod';
import PaymentMethodDetail from './components/views/PaymentMethodDetail';
import ProtectedRoute from './components/authentication/ProtectedRoute';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/pay' element={<Pay />} />
          <Route path='/search' element={<Search />} />
          <Route path='/payment-methods' element={<PaymentMethod />} />
          <Route path='/payment-methods/:payment_method_id' element={<PaymentMethodDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
