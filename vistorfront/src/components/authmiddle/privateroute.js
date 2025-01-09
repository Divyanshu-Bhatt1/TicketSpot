import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../authmiddle/useAuth';

// const PrivateRoute = ({ element: Component, ...rest }) => {
//   const { authenticated, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>; // Show a loading screen while checking authentication
//   }

//   return authenticated ? <Component {...rest} /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;


const PrivateRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading screen while checking authentication
  }

  return authenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
