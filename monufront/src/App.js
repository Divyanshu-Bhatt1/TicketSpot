import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import PrivateRoute from './components/authmiddle/privateroute';
import useAuth from '../src/components/authmiddle/useAuth';
import useStore from './components/utils/store';
import Register from './components/Register';
import Login from './components/Login';
import Feedback from './components/Feedback';
import ShowCompete from './components/ShowCompete'
import 'bootstrap/dist/css/bootstrap.min.css';
import EventCreation from './components/EventCreation';
import EventShow from './components/EventShow';
import ToggleComponent from './components/ToggleComponent';
import QRScanner from './components/scanTicket/QRScanner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const { isLoactionExist} = useStore()
  const { authenticated } = useAuth();


  return (
    <>
    <ToastContainer />
    <Routes>
       
      {/* Private route for Home, only accessible if authenticated */}
      <Route path="/" element={<PrivateRoute element={ToggleComponent}/>} />
      <Route path="/feedback" element={<PrivateRoute element={Feedback} />} />
     <Route path="/event-show" element={<PrivateRoute element={EventShow} />} /> 
      {/*<Route path="/event-creation" element={<PrivateRoute element={EventCreation} />} />
      <Route path="/show-competitor" element={<PrivateRoute element={ShowCompete} />} />
       */}
       
       <Route path="/ticket-scan" element={<PrivateRoute element={QRScanner} />} />

      
      {/* Public routes for Login and Register, but hide them if authenticated */}
      <Route path="/login" element={authenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={authenticated ? <Navigate to="/" /> : <Register />} />
      
     
      {/* Redirect any unknown routes to Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
