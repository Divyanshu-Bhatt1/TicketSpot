import React, { useState } from "react";
import axios from "axios";
import "./css/LocationForm.css";
import { useNavigate } from "react-router-dom";
import loc from "./assets/Location_Logo.avif";

const LocationForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Handle changes to form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/auth/userLocation`, formData,{ withCredentials: true });
      console.log("Response:", response.data.success);
      if(response.data.success==true)
      {
        navigate('/home')
      }
      // Handle success (e.g., show a success message, clear the form, etc.)
    } catch (error) {
      console.error("Error submitting form data:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Location Icon */}
        <div
          className="logo-container"
          style={{ gap: "10px", display: "flex" }}
        >
          <img
            style={{ borderRadius: "22px" }}
            src={loc}
            alt="Location Icon"
            className="location-logo"
          />
          <span
            style={{
              textAlign: "center",
              fontSize: "21px",
              fontWeight: "700",
              padding: "10px 0",
            }}
          >
            Give Your Location
          </span>
        </div>

        {/* Form fields */}
        <div className="form-grid">
          <div className="form-group">
            <label>Street:</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Zip Code:</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-6 w-1/2 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-colors shadow-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;
