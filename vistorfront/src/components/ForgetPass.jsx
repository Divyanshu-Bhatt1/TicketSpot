import React, { useState } from 'react';
import Logo from './assets/LogoTicketspott.png';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'
import OTPInput from "./OTPInput";

const ForgetPass = () => {
  const [email, setEmail] = useState('');
  const [toggleOtp, setToggleOtp] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleHidden = () => {
    setHidden(!hidden);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/auth/sent-otp-forget`, {
        email: email
      }, {
        withCredentials: true
      });
      setToggleOtp(true);
    } catch (error) {
      console.error("There was an error!", error);
      window.location.reload();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/auth/forget-pass`, {
        email: email,
        password: password
      }, {
        withCredentials: true
      });
      navigate("/");
      window.location.reload();
    } catch (error) {
      setToggleOtp(false);
      console.error("There was an error!", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!toggleOtp ? (
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#faa935] p-6 flex items-center justify-center">
            <img src={Logo} alt="Logo" className="w-16 h-16 rounded-full border-2 border-white shadow-lg object-cover" />
            <h2 className="text-2xl font-bold text-white ml-4">
              {hidden ? 'Reset Password' : 'Forgot Password'}
            </h2>
          </div>
          <form onSubmit={!hidden ? handleSubmit : handleUpdate} className="p-6 space-y-4">
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
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#faa935] focus:border-[#faa935]"
                  placeholder="Enter your email"
                />
                <span className="absolute left-3 top-2 text-gray-400">
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </span>
              </div>
            </div>
            {hidden && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#faa935] focus:border-[#faa935]"
                    placeholder="Enter new password"
                  />
                  <span className="absolute left-3 top-2 text-gray-400">
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-[#faa935] text-white py-2 px-4 rounded-md font-medium hover:bg-[#e99830] focus:outline-none focus:ring-2 focus:ring-[#faa935] focus:ring-offset-2 transition duration-200"
            >
              {!hidden ? 'Send OTP' : 'Reset Password'}
            </button>
          </form>
          {!hidden && (
            <div className="text-center pb-6">
              <Link to="/login" className="text-sm text-[#faa935] hover:underline">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      ) : (
        <OTPInput setToggleOtp={setToggleOtp} email={email} handleHidden={handleHidden} url='verify-otp-forgot'/>
      )}
    </div>
  );
};

export default ForgetPass;

