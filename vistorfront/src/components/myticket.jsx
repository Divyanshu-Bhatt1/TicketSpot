import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to install axios
import "./css/myticket.css";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]); // State for tickets
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(''); // State for error messages

  // Function to fetch tickets from the API
  const fetchTickets = async () => {
    setLoading(true); // Start loading
    const token = localStorage.getItem('token'); // Assuming the token is stored in local storage

    try {
      const response = await axios.get('http://localhost:5000/api/auth/mytickets', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
        withCredentials: true
      });
      setTickets(response.data); // Set the tickets data
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError('Failed to fetch tickets. Please try again.'); // Display an error message
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="my-tickets">
      <h2>Your Tickets</h2>
      {loading ? (
        <p>Loading your tickets...</p>
      ) : error ? (
        <p className="error-message">{error}</p> // Display error message if there's an error
      ) : tickets.length > 0 ? (
        <div className="tickets-container">
          {tickets.map(ticket => (
            <div key={ticket._id} className="ticket">
              <h4>Ticket Number: {ticket.ticketNo}</h4>
              <p>Event ID: {ticket.eventId}</p>
              <p>User ID: {ticket.userId}</p>
              <p>Price: ${ticket.price}</p>
              <p>Purchased At: {new Date(ticket.purchasedAt).toLocaleString()}</p>
              <p>Selected Date: {new Date(ticket.selectedDate).toLocaleString()}</p>
              <p>Expiration Date: {new Date(ticket.ExpirationDate).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
};

export default MyTickets;
