import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";
import axios from "axios"; // for API requests
import './css/EventShow.css'; // Optional: Add custom styling if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function EventShow() {
  // State to hold events
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1); // for pagination
  const [loading, setLoading] = useState(false); // for loading state

  // Fetch events when the component mounts or page changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/events-show?page=${page}&limit=8`,{withCredentials:true}); // Adjust the API endpoint
        if (page === 1) {
          console.log(response.data.events)
          setEvents(response.data.events);
        } else {
          setEvents((prevEvents) => [...prevEvents, ...response.data.events]);
        }
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  // Function to handle event deletion
  const handleDelete = async (eventId) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/agency/events-delete/${eventId}`,{withCredentials:true}); // Adjust the API endpoint for deletion
        setEvents(events.filter(event => event._id !== eventId)); // Remove event from the list
        alert("Event deleted successfully");
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  // Function to load more events
  const loadMore = () => {
    setPage(page + 1);
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return str; // Check for empty string
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div>
      <NavBar />
      <div className="event-card-container">
        {events.map((event) => (
          <div key={event._id} className="ev-show-card">
          <div className="ev-show-card-header-cont">
            <h5 className="ev-show-card-header">{capitalizeFirstLetter(event.eventName)}</h5>
            <div className="ev-show-del" onClick={() => handleDelete(event._id)}>
                 <FontAwesomeIcon icon={faTrash} size="lg"  className='trash'/>
           </div>
          </div>
            <div className="ev-show-card-body">
            <span style={{marginBottom:'15px'}}>Show Event Detail</span><br/>
              <p className="card-text">
              {/* <span className='ev-show-spec-txt'><strong>Category:</strong> {event.eventCategory}</span>  */}
              <span className='ev-show-spec-txt'><strong>Date of Opening:</strong> {new Date(event.eventDate).toDateString()}</span> 
                <span className='ev-show-spec-txt'><strong>Visiting Time:</strong> {event.eventTime}</span> 
                <span className='ev-show-spec-txt'><strong>Ticket Price:</strong> ₹{event.eventTicketPrice}</span> 
                <span className='ev-show-spec-txt'><strong>Tickets Available:</strong> {event.eventTotalTicketsAvailable}</span> 
                <span className='ev-show-spec-txt'><strong>Category:</strong> {event.category}</span> 
                <span className='ev-show-spec-txt'><strong>Audience Type:</strong> {event.audience_type}</span> 
                <span className='ev-show-spec-txt'><strong>Created At:</strong> {event.createdAt}</span> 
                {/* <span className='ev-show-spec-txt'><strong>Status:</strong> {event.status}</span> */}
              </p>
              {/* <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleDelete(event._id)} className="btn btn-danger">
                  Delete
                </button>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {events.length > 0 && (
        <div className="load-more-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <button onClick={loadMore} className="btn btn-primary">Load More</button>
          )}
        </div>
      )}
    </div>
  );
}
