import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useToken from '../../hooks/useToken';

const ProtectedRoute = ({ children }) => {
  const { token } = useToken();

  if (!token) {
    return <Navigate to='/' />;
  }

  return children ? children : <Outlet></Outlet>;
};

export default ProtectedRoute;
