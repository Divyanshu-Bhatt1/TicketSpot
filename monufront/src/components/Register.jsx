import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OTPInput from './OTPInput';
import Logo from './assets/LogoTicketspott.png' // Assume this is your logo file


const Register = () => {
  // State management for the form fields
  const [agencyName, setAgencyName] = useState(''); // New agency name state
  const [monumentName, setMonumentName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  // const [monumentLogo, setMonumentLogo] = useState(null);
  const [location, setLocation] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [toggleOtp, setToggleOtp] = useState(false);

  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Form submission using Axios
      // const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/agency/register`, {
      //   agencyName: agencyName, // Sending the agency name
      //   monumentName: monumentName,
      //   email: email,
      //   password: password,
      //   contactNumber: contactNumber,
      //   category:category,
      //   monumentLogo: monumentLogo,
      //   location: location,
      // }, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   withCredentials: true, // To send cookies with requests
      // });

const formData = new FormData();
formData.append('agencyName', agencyName);
formData.append('monumentName', monumentName);
formData.append('email', email);
formData.append('password', password);
formData.append('contactNumber', contactNumber);
// formData.append('monumentLogo', monumentLogo); // monumentLogo should be the file object
formData.append('location.street', location.street);
formData.append('location.city', location.city);
formData.append('location.state', location.state);
formData.append('location.zipCode', location.zipCode);


const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/agency/register`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

      console.log(result.data)
      setToggleOtp(true); // Toggle OTP on successful registration
      

    } catch (error) {
      console.error("There was an error registering the monument!", error);
      setToggleOtp(false); // Handle error
    }
  };

  const handleLocationChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  // const handleFileChange = (e) => {
  //   setMonumentLogo(e.target.files[0]); // Update state with the selected file
  // };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!toggleOtp ? (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg" style={{marginTop: '280px'}}>
          <div className="text-center mb-4">
            <img src={Logo} alt="Logo" className="mx-auto w-29 h-20 sm:w-29 sm:h-24" />
          </div>
          <h2 className="text-xl font-bold text-center mb-6">Register Monument</h2>

          <form onSubmit={handleSubmit}>
            {/* Agency Name */}
            <div className="mb-4">
              <label htmlFor="agencyName" className="block text-gray-700 font-medium">Agency Name:</label>
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>

            {/* Monument Name */}
            <div className="mb-4">
              <label htmlFor="monumentName" className="block text-gray-700 font-medium">Monument Name:</label>
              <input
                type="text"
                id="monumentName"
                name="monumentName"
                value={monumentName}
                onChange={(e) => setMonumentName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <label htmlFor="contactNumber" className="block text-gray-700 font-medium">Contact Number:</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>

            

            {/* Monument Logo */}
            {/* <div className="mb-4">
              <label htmlFor="monumentLogo" className="block text-gray-700 font-medium">Monument Logo:</label>
              <input
                type="file"
                id="monumentLogo"
                name="monumentLogo"
                onChange={handleFileChange} // Handle file change
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div> */}

            {/* Location */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Location:</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={location.street}
                  onChange={handleLocationChange}
                  className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={location.city}
                  onChange={handleLocationChange}
                  className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={location.state}
                  onChange={handleLocationChange}
                  className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={location.zipCode}
                  onChange={handleLocationChange}
                  className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Register Monument
            </button>
          </form>
        </div>
      ) : (
        <OTPInput setToggleOtp={setToggleOtp} email={email} url='verify-otp' />
      )}
    </div>
  );
};

export default Register;
