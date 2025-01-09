import React, { useState } from 'react';
import BookingDetails from './BookingDetails';
import Navbar from "./Navbar"
import axios from "axios";
import './css/profile.css';
import Footer from "./footer.jsx"

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('my-bookings');
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [roomType, setRoomType] = useState('standard');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([
    {
      id: 1,
      museumName: 'The Louvre',
      logo: '/placeholder.svg?height=50&width=50',
      date: '2023-06-15',
      status: 'Confirmed',
      ticketType: 'Adult',
      visitors: 2,
      totalPrice: '€30'
    },
    {
      id: 2,
      museumName: 'British Museum',
      logo: '/placeholder.svg?height=50&width=50',
      date: '2023-07-22',
      status: 'Cancelled',
      ticketType: 'Family',
      visitors: 4,
      totalPrice: '£40'
    },
    {
      id: 3,
      museumName: 'Metropolitan Museum of Art',
      logo: '/placeholder.svg?height=50&width=50',
      date: '2023-08-05',
      status: 'Confirmed',
      ticketType: 'Senior',
      visitors: 1,
      totalPrice: '$20'
    },
    {
      id: 4,
      museumName: 'Uffizi Gallery',
      logo: '/placeholder.svg?height=50&width=50',
      date: '2023-09-10',
      status: 'Pending',
      ticketType: 'Student',
      visitors: 1,
      totalPrice: '€15'
    }
  ]);
const mybookings=()=>{
const response=axios.get("http://localhost:3000/mybookings}")
}
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    setSelectedBooking(null);
  };

  return (
    <>
    <Navbar></Navbar>
    <div className="profile-container">
      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'my-bookings' ? 'active' : ''}`}
          onClick={() => handleTabClick('my-bookings')}
        >
          My Bookings
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabClick('settings')}
        >
          Settings
        </button>
        <button
          className={`tab ${activeTab === 'personal-info' ? 'active' : ''}`}
          onClick={() => handleTabClick('personal-info')}
        >
          Personal Info
        </button>
        <button
          className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => handleTabClick('preferences')}
        >
          Preferences
        </button>
      </nav>
      <main className="tab-content">
        {activeTab === 'my-bookings' && (
          <section>
            <ul className="bookings-list">
              {bookings.map((booking) => (
                <li key={booking.id} className="booking-item" onClick={() => handleBookingClick(booking)}>
                  <img src={booking.logo} alt={`${booking.museumName} logo`} className="museum-logo" />
                  <div className="booking-details">
                    <h3>{booking.museumName}</h3>
                    <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                    <p className={`booking-status ${getStatusColor(booking.status)}`}>
                      Status: {booking.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {activeTab === 'settings' && (
          <section>
            <h2>Settings</h2>
            <p>Manage your account settings here.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email-notifications">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  Email Notifications
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="sms-notifications">
                  <input
                    type="checkbox"
                    id="sms-notifications"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                  />
                  SMS Notifications
                </label>
              </div>
              <button type="submit">Save Settings</button>
            </form>
          </section>
        )}
        {activeTab === 'personal-info' && (
          <section>
            <h2>Personal Information</h2>
            <p>Update your personal details here.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit">Update Information</button>
            </form>
          </section>
        )}
        {activeTab === 'preferences' && (
          <section>
            <h2>Preferences</h2>
            <p>Set your travel preferences here.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="room-type">Preferred Room Type:</label>
                <select
                  id="room-type"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="diet">Dietary Requirements:</label>
                <input
                  type="text"
                  id="diet"
                  value={dietaryRequirements}
                  onChange={(e) => setDietaryRequirements(e.target.value)}
                  placeholder="e.g., Vegetarian, Gluten-free"
                />
              </div>
              <button type="submit">Save Preferences</button>
            </form>
          </section>
        )}
      </main>
      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={handleCloseModal}
          onDelete={handleDeleteBooking}
        />
      )}
    </div>
    <Footer/>
    </>
  );
};

export default ProfilePage;

