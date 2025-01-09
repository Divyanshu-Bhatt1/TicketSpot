// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "../css/login.css";

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate(); // Initialize useNavigate

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const result = await axios.post("http://localhost:5000/api/auth/login", {
//                 email: email,
//                 password: password
//             }, {
//                 withCredentials: true
//             });

//             console.log(result);

//             // Navigate to the home page on successful login
//             navigate('/');
//             window.location.reload();
//         } catch (error) {
//             console.error("There was an error!", error);
//             // Optionally handle error, e.g., show an error message
//         }
//     };

//     return (
//         <div className="login-container">
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="input-group">
//                     <label htmlFor="email">Email:</label>
//                     <input 
//                         type="email" 
//                         id="email" 
//                         name="email" 
//                         value={email} 
//                         onChange={(e) => setEmail(e.target.value)} 
//                         required 
//                     />
//                 </div>
//                 <div className="input-group">
//                     <label htmlFor="password">Password:</label>
//                     <input 
//                         type="password" 
//                         id="password" 
//                         name="password" 
//                         value={password} 
//                         onChange={(e) => setPassword(e.target.value)} 
//                         required 
//                     />
//                 </div>
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// }

// export default Login;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
// import "../css/login.css"; // Your custom CSS
import Logo from './assets/LogoTicketspott.png'
import { showSuccessToast, showInfoToast, showErrorToast } from '../components/utils/toastUtils'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/api/agency/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(result);
      setEmail('');
      setPassword('');
      // if(result.status===201){
        // showSuccessToast(result.data.msg)
      

      // Navigate to the home page on successful login
      navigate("/");
      window.location.reload();
      // }
    } catch (error) {
      console.error("There was an error!", error);
      // Optionally handle error, e.g., show an error message
    }
  };

  return (
    <div style={{width:'100vw',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <div className="w-full max-w-xs sm:max-w-sm bg-white p-6 sm:p-8 rounded-lg shadow-lg login-container">
      <div className="text-center mb-4">
        <img src={Logo} alt="Logo" className="mx-auto w-29 h-20 sm:w-29 sm:h-24" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
      
        <div className="mb-4 relative">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email:</label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.28 0 4.25-1.472 4.25-3.25S14.28 5.5 12 5.5s-4.25 1.472-4.25 3.25S9.72 12 12 12zm0 2.25c-3.06 0-5.5 1.528-5.5 3.5v.25h11v-.25c0-1.972-2.44-3.5-5.5-3.5z"></path>
              </svg>
            </span>
          </div>
        </div>
        <div className="mb-4 sm:mb-6 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6v14h16V6H4zm12 10h-8v-4h8v4z"></path>
              </svg>
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-4">
          <label className="flex items-center mb-2 sm:mb-0">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="ml-2 text-gray-700">Remember Me</span>
          </label>
          <Link to="/forgot-pass" className="text-blue-500 hover:text-blue-700 text-sm">
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-colors shadow-md"
        >
          Login
        </button>
      </form>
      <div className="text-center mt-4">
        <Link to="/register" className="text-blue-500 hover:text-blue-700 text-sm">
          Don&apos;t have an account? Register
        </Link>
      </div>
    </div>
    </div>
  );
};

export default Login;
