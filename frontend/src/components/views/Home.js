import React, {useState} from 'react'
import LoginForm from '../authentication/Login.jsx';


function Home() {
    const adminUser = {
        email: "admin@admin.com",
        password: "admin123",
      };
      
    const [user, setUser] = useState({ name: "", email: "" });
    const [error, setError] = useState("");
    
    const Login = (details) => {
      console.log(details);
    
      if (details.email === adminUser.email && details.password === adminUser.password) {
        console.log("Logged in");
        setUser({
          name: details.email,
          email: details.email,
        });
      } else {
        setError("Autenticación incorrecta");
      }
    
    }
    
    const Logout = () => {
      setUser({ name: "", email: "" });
    }

    return (
        <div>
            {(user.email !== "")?(
            <div className='h-full bg-sky-900'>
                <div className='container  mx-0 min-w-full grid place-items-center'>
                    <button onClick={Logout} className='w-1/4 my-5 py-2 center text-lg bg-amber-500 text-white font-semibold rounded-lg'>Cerrar sesión</button>  
                </div>
            </div>
            ):(
                <LoginForm Login={Login} error={error}/>
            )}
        </div>
    );
}

export default Home;