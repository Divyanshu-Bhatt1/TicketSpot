import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/home';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/authmiddle/privateroute';
import useAuth from '../src/components/authmiddle/useAuth';
import ForgetPass from './components/ForgetPass';
import Search from './components/Search';
import LocationForm from './components/LocationForm';
import useStore from './components/utils/store';
import Myticket from "./components/myticket"
import ProductPage from './components/productpage'
import Profile from "./components/profile"
import Payment from "./components/payment"
function App() {
  const { isLoactionExist } = useStore()
  const { authenticated } = useAuth();


  return (
    <Routes>
      {/* Private route for Home, only accessible if authenticated */}
      {/* <Route path="/" element={<PrivateRoute element={Home} />} /> */}
      <Route path="/get-location" element={!isLoactionExist && authenticated ? <LocationForm /> : <Navigate to="/" />} />
      {/* <Route path="/search" element={<PrivateRoute element={Search} />}  /> */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        }
      />


      <Route
        path="/search"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <PrivateRoute>
            <ProductPage />
          </PrivateRoute>
        }
      />

      <Route path="/myticket" element={<Myticket />} />
      <Route path="/profile" element={<Profile />} />




      {/* Public routes for Login and Register, but hide them if authenticated */}
      <Route path="/login" element={authenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={authenticated ? <Navigate to="/" /> : <Register />} />
      <Route path="/forgot-pass" element={authenticated ? <Navigate to="/" /> : <ForgetPass />} />




      {/* Redirect any unknown routes to Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
