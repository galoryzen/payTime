import {Routes, Route} from 'react-router-dom';
import Home from './components/views/Home'
import Login from './components/authentication/Login.jsx';
import SignUp from './components/authentication/SignUp.jsx';
import Pay from './components/views/Pay'
import Payout from './components/views/Payout'
import Search from './components/views/Search'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/pay' element={<Pay/>}/>
        <Route path='/payout' element={<Payout/>}/>
        <Route path='/search' element={<Search/>}/>
      </Routes>
    </div>
  );
}

export default App;
