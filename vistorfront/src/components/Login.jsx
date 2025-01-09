import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from './assets/LogoTicketspott.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(result);
      setEmail('');
      setPassword('');

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("There was an error!", error);
      // TODO: Add error handling, e.g., show an error message to the user
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#faa935] p-6 flex items-center justify-center">
          <img src={Logo} alt="Logo" className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover" />
          
          <h2 className="text-2xl font-bold text-white ml-4">Welcome Back</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#faa935] focus:border-[#faa935]"
                placeholder="Enter your email"
              />
              <span className="absolute right-3 top-2 text-gray-400">
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#faa935] focus:border-[#faa935]"
                placeholder="Enter your password"
              />
              <span className="absolute right-3 top-2 text-gray-400">
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-[#faa935] rounded border-gray-300 focus:border-[#faa935]" />
              <span className="ml-2 text-sm text-gray-600">Remember Me</span>
            </label>
            <Link to="/forgot-pass" className="text-sm text-[#faa935] hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-[#faa935] text-white py-2 px-4 rounded-md font-medium hover:bg-[#e99830] focus:outline-none focus:ring-2 focus:ring-[#faa935] focus:ring-offset-2 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <div className="text-center pb-6">
          <Link to="/register" className="text-sm text-[#faa935] hover:underline">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

