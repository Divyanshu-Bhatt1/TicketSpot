import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom";

const OTPInput = ({setToggleOtp,email,url,handleHidden}) => {

  const [otp, setOtp] = useState(new Array(4).fill(''));
  const inputsRef = useRef([]);
  const navigate=useNavigate();

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (value) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = value;
        return newOtp;
      });
      if (index < otp.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (index) => {
    if (index > 0) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = '';
        return newOtp;
      });
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      newOtp[i] = char;
      inputsRef.current[i].value = char;
    });
    setOtp(newOtp);
    inputsRef.current[newOtp.length - 1].focus();
  };

  const handleOtp = async(e) => {
    e.preventDefault();
    try {
        const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/agency/${url}`, {
          email: email,
          otpCode:otp.join('')
        }, {
          withCredentials: true // Ensure cookies are sent with requests
        });
  
        // console.log(result.data); // Handle success
        if(url==='verify-otp-forgot')
        {
            handleHidden()
        }else{
        navigate("/");
        window.location.reload();
        }
  
      } catch (error) {
        setToggleOtp(false)
        console.error("There was an error!", error); // Handle error
      }
  };

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  return (
    <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Mail Verification</h1>
        <p className="text-[15px] text-slate-500">Enter the 4-digit verification code that was sent to your mail.</p>
      </header>
      <form id="otp-form" onSubmit={handleOtp}>
        <div className="flex items-center justify-center gap-3">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' || e.key === 'Delete') handleBackspace(index);
              }}
              onPaste={handlePaste}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          ))}
        </div>
        <div className="max-w-[260px] mx-auto mt-4">
          <button
            type="submit"
            className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
          >
            Verify Account
          </button>
        </div>
      </form>
      {/* <div className="text-sm text-slate-500 mt-4">
        Didn't receive code? <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Resend</a>
      </div> */}
    </div>
  );
};

export default OTPInput;
