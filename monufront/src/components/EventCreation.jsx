// import React, { useState } from 'react';
// import axios from 'axios';
// import './css/EventCreation.css';

// const EventCreation = () => {
//   const [eventData, setEventData] = useState({
//     eventName: '',
//     totalTicketsAvailable: 0,
//     eventDate: '',
//     ticketPrice: 0,
//     eventTime: '',
//     description: ''
//   });

//   const [errors, setErrors] = useState({}); // State to track field errors

//   // Handle change in input fields
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEventData({
//       ...eventData,
//       [name]: value,
//     });
//     setErrors({
//       ...errors,
//       [name]: '', // Clear error for the field being edited
//     });
//   };

//   // Validate all fields
//   const validate = () => {
//     const newErrors = {};

//     if (!eventData.eventName.trim()) newErrors.eventName = 'Event Name is required.';
//     if (!eventData.totalTicketsAvailable || eventData.totalTicketsAvailable <= 0)
//       newErrors.totalTicketsAvailable = 'Total Tickets Available must be a positive number.';
//     if (!eventData.eventDate) newErrors.eventDate = 'Event Date is required.';
//     if (!eventData.ticketPrice || eventData.ticketPrice <= 0)
//       newErrors.ticketPrice = 'Ticket Price must be a positive number.';
//     if (!eventData.eventTime.trim()) newErrors.eventTime = 'Event Time is required.';
//     if (!eventData.description.trim()) newErrors.description = 'Description is required.';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return; // Stop if validation fails

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACK_URL}/api/agency/event-creation`,
//         eventData,
//         { withCredentials: true }
//       );
//       alert('Event Created Successfully!');
//       console.log(response);
//     } catch (error) {
//       console.error('There was an error creating the event:', error);
//     }
//   };

//   return (
//     <div className="create-event-container">
//       <h1>Manage Monument</h1>
//       <p>Add Monument in the System</p>
//       <form onSubmit={handleSubmit} className="event-creation-form">
//         {/* Event Name */}
//         <div className="event-creation-form-group">
//           <label>Event Name</label>
//           <input
//             type="text"
//             name="eventName"
//             value={eventData.eventName}
//             onChange={handleChange}
//             placeholder="Enter event name"
//             className="input-field"
//           />
//           {errors.eventName && <span className="error-message">{errors.eventName}</span>}
//         </div>

        

//         {/* Total Tickets Available */}
//         <div className="event-creation-form-group">
//           <label>Total Tickets Available</label>
//           <input
//             type="number"
//             name="totalTicketsAvailable"
//             value={eventData.totalTicketsAvailable}
//             onChange={handleChange}
//             placeholder="Enter total tickets"
//             className="input-field"
//           />
//           {errors.totalTicketsAvailable && (
//             <span className="error-message">{errors.totalTicketsAvailable}</span>
//           )}
//         </div>

//         {/* Event Date */}
//         <div className="event-creation-form-group">
//   <label>Event Date</label>
//   <input
//     type="date"
//     name="eventDate"
//     value={eventData.eventDate}
//     onChange={handleChange}
//     className="input-field"
//     min={new Date().toISOString().split("T")[0]} // Set the minimum date to today
//     max={new Date(new Date().setDate(new Date().getDate() + 4))
//       .toISOString()
//       .split("T")[0]} // Set the maximum date to 4 days from today
//   />
//   {errors.eventDate && <span className="error-message">{errors.eventDate}</span>}
// </div>

//         {/* Ticket Price */}
//         <div className="event-creation-form-group">
//           <label>Ticket Price</label>
//           <input
//             type="number"
//             name="ticketPrice"
//             value={eventData.ticketPrice}
//             onChange={handleChange}
//             placeholder="Enter ticket price in INR"
//             className="input-field"
//           />
//           {errors.ticketPrice && <span className="error-message">{errors.ticketPrice}</span>}
//         </div>

//         {/* Event Time */}
//         <div className="event-creation-form-group">
//           <label>Event Time</label>
//           <input
//             type="text"
//             name="eventTime"
//             value={eventData.eventTime}
//             onChange={handleChange}
//             placeholder="e.g. from : 6:00 A.M. - 18:00 P.M."
//             className="input-field"
//           />
//           {errors.eventTime && <span className="error-message">{errors.eventTime}</span>}
//         </div>

//         {/* Description */}
//         <div className="event-creation-form-group full-width">
//           <label>Description</label>
//           <textarea
//             name="description"
//             value={eventData.description}
//             onChange={handleChange}
//             placeholder="Enter event description"
//             className="input-field textarea"
//           ></textarea>
//           {errors.description && <span className="error-message">{errors.description}</span>}
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="submit-button">
//           Create Event
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EventCreation;



import React, { useState } from 'react';
import axios from 'axios';
import './css/EventCreation.css';

const EventCreation = () => {
  const [eventData, setEventData] = useState({
    eventName: '',
    totalTicketsAvailable: 0,
    eventDate: '',
    ticketPrice: 0,
    eventTime: '',
    description: '',
    category: '', // Added state for category
    audienceType: '', // Added state for audienceType
  });

  const [errors, setErrors] = useState({}); // State to track field errors

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '', // Clear error for the field being edited
    });
  };

  // Validate all fields
  const validate = () => {
    const newErrors = {};

    if (!eventData.eventName.trim()) newErrors.eventName = 'Event Name is required.';
    if (!eventData.totalTicketsAvailable || eventData.totalTicketsAvailable <= 0)
      newErrors.totalTicketsAvailable = 'Total Tickets Available must be a positive number.';
    if (!eventData.eventDate) newErrors.eventDate = 'Event Date is required.';
    if (!eventData.ticketPrice || eventData.ticketPrice <= 0)
      newErrors.ticketPrice = 'Ticket Price must be a positive number.';
    if (!eventData.eventTime.trim()) newErrors.eventTime = 'Event Time is required.';
    if (!eventData.description.trim()) newErrors.description = 'Description is required.';
    if (!eventData.category) newErrors.category = 'Category is required.';
    if (!eventData.audienceType) newErrors.audienceType = 'Audience Type is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if validation fails

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/api/agency/event-creation`,
        eventData,
        { withCredentials: true }
      );
      alert('Event Created Successfully!');
      console.log(response);
    } catch (error) {
      console.error('There was an error creating the event:', error);
    }
  };

  return (
    <div className="create-event-container">
      <h1>Manage Museum</h1>
      <p>Add Museum in the System</p>
      <form onSubmit={handleSubmit} className="event-creation-form">
        {/* Event Name */}
        <div className="event-creation-form-group">
          <label>Event Name</label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            className="input-field"
          />
          {errors.eventName && <span className="error-message">{errors.eventName}</span>}
        </div>

        {/* Total Tickets Available */}
        <div className="event-creation-form-group">
          <label>Total Tickets Available</label>
          <input
            type="number"
            name="totalTicketsAvailable"
            value={eventData.totalTicketsAvailable}
            onChange={handleChange}
            placeholder="Enter total tickets"
            className="input-field"
          />
          {errors.totalTicketsAvailable && (
            <span className="error-message">{errors.totalTicketsAvailable}</span>
          )}
        </div>

        {/* Event Date */}
        <div className="event-creation-form-group">
          <label>Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
            max={new Date(new Date().setDate(new Date().getDate() + 4))
              .toISOString()
              .split('T')[0]}
          />
          {errors.eventDate && <span className="error-message">{errors.eventDate}</span>}
        </div>

        {/* Ticket Price */}
        <div className="event-creation-form-group">
          <label>Ticket Price</label>
          <input
            type="number"
            name="ticketPrice"
            value={eventData.ticketPrice}
            onChange={handleChange}
            placeholder="Enter ticket price in INR"
            className="input-field"
          />
          {errors.ticketPrice && <span className="error-message">{errors.ticketPrice}</span>}
        </div>

        {/* Event Time */}
        <div className="event-creation-form-group">
          <label>Event Time</label>
          <input
            type="text"
            name="eventTime"
            value={eventData.eventTime}
            onChange={handleChange}
            placeholder="e.g. from : 6:00 A.M. - 18:00 P.M."
            className="input-field"
          />
          {errors.eventTime && <span className="error-message">{errors.eventTime}</span>}
        </div>

        {/* Description */}
        <div className="event-creation-form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            className="input-field textarea"
          ></textarea>
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Category Dropdown */}
        <div className="event-creation-form-group">
          <label>Category</label>
          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select category</option>
            <option value="educational">Educational</option>
            <option value="scientific">Scientific</option>
            <option value="cultural">Cultural</option>
            <option value="historical">Historical</option>
            <option value="artistic">Artistic</option>
            <option value="technological">Technological</option>
            <option value="interactive">Interactive</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        {/* Audience Type Dropdown */}
        <div className="event-creation-form-group">
          <label>Audience Type</label>
          <select
            name="audienceType"
            value={eventData.audienceType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select audience type</option>
            <option value="family">Family</option>
            <option value="student">Student</option>
            <option value="general">General</option>
            <option value="children">Children</option>
            <option value="solo">Solo</option>
          </select>
          {errors.audienceType && <span className="error-message">{errors.audienceType}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventCreation;
