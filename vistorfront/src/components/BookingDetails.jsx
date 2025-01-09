import React from 'react';
import './css/bookingdetails.css';

const BookingDetails = ({ booking, onClose, onDelete }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{backgroundColor:"#fff"}}>
        <h2>{booking.museumName} Booking Details</h2>
        <img src={booking.logo} alt={`${booking.museumName} logo`} className="museum-logo" />
        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
        <p><strong>Ticket Type:</strong> {booking.ticketType}</p>
        <p><strong>Number of Visitors:</strong> {booking.visitors}</p>
        <p><strong>Total Price:</strong> {booking.totalPrice}</p>
        <div className="modal-actions">
          <button onClick={() => onDelete(booking.id)} className="delete-button">Delete Booking</button>
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

