import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./footer";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css/search.css';

const Museums = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  const navigate = useNavigate();
  const [monuments, setMonuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    region: '',
    priceRange: '',
    category: ''
  });

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/auth/search-monuments/${searchQuery}`, {
          params: filters
        });
        setMonuments(response.data.monuments);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch monuments. Please try again.');
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchMonuments();
    }
  }, [searchQuery, filters]);

  const Book=(MonumentId)=>{
    navigate(`/product/${MonumentId}`);
  }
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="museums-loading">Loading...</div>;
  }

  if (error) {
    return <div className="museums-error">{error}</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="museums-container">
      <h3 className="museums-title">Search Results for "{searchQuery}"</h3>
      {monuments.length === 0 ? (
        <div className="no-results">No monuments found for the specified criteria.</div>
      ) : (
        <div className="museums-grid">
          {monuments.map((monument) => (
            <div key={monument._id} className="museum-card">
              <img src={monument.imageUrl[0]} alt={monument.MonumentName} className="museum-image" />
              <div className="museum-info">
                <h2 className="museum-name">{monument.MonumentName}</h2>
                <p className="museum-location">{`${monument.location.city}, ${monument.location.state}`}</p>
                <p className="museum-timing">{monument.timing}</p>
                <p className="museum-price">Ticket Price: ₹{monument.ticketPrice}</p>
                <p className="museum-availability">Available Tickets: {monument.totalAvailableTicket}</p>
                <p className="museum-category">Category: {monument.category}</p>
                <button className="book-button" onClick={()=>Book(monument._id)}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Museums;
