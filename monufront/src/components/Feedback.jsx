import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './css/Feedback.css';
import NavBar from './Navbar';

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [loadCount, setLoadCount] = useState(3); // Number of feedbacks to load initially
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalFeedbacks, setTotalFeedbacks] = useState(0); // Total number of feedbacks
  const [hasMore, setHasMore] = useState(true); // Flag to check if there are more feedbacks

  // Function to fetch feedback data from API
  const fetchFeedbackData = async () => {
    const limit = loadCount; // Number of feedbacks per page
    const page = currentPage; // Current page

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/show-review?limit=${limit}&page=${page}`, { withCredentials: true });
      
      // If the current page is 1, reset the feedback data; otherwise, append the new feedbacks
      setFeedbackData((prevData) => (page === 1 ? response.data.reviews : [...prevData, ...response.data.reviews]));
      
      setTotalFeedbacks(response.data.total); // Total feedbacks count from response
      setVisibleComments((prev) => [...prev, ...Array(response.data.reviews.length).fill(false)]); // Initialize visibility state
      setHasMore((page * limit) < response.data.total); // Check if there are more feedbacks
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };

  // Load more feedbacks
  const loadMoreFeedbacks = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Go to the next page
  };

  // Toggle function to show/hide the full comment
  const toggleComment = (index) => {
    const updatedVisibility = [...visibleComments];
    updatedVisibility[index] = !updatedVisibility[index];
    setVisibleComments(updatedVisibility);
  };

  useEffect(() => {
    fetchFeedbackData(); // Fetch feedback data when component mounts or page changes
  }, [currentPage]); // Remove loadCount from dependencies

  return (
    <div>
          <NavBar/>
    <div className="feedback-list">
      {feedbackData.map((feedback, index) => {
        const { userName, rating, comment, createdAt } = feedback;
        const showFullComment = visibleComments[index];
        const commentToDisplay = showFullComment ? comment : `${comment.slice(0, 100)}...`;

        return (
         
          <div className="card1" key={index}>
            <div className="card1-header">
            <div className="feed-profi">
          <div className="feed-pro-cont">
             <FontAwesomeIcon icon={faUser} />
          </div>
            <h5>{userName}</h5>
            </div>

              <div className='feed-rating'>
                  <span>Rating: </span>
                   {Array.from({ length: rating }, (_, index) => (
                        <span key={index}>⭐</span>
                    ))}
             </div>
            </div>
            <div className="card1-body">
              <p className="card1-text">{commentToDisplay}</p>
              <button className="btn btn-link feed-show-more" onClick={() => toggleComment(index)}>
                {showFullComment ? 'Show Less' : 'Show More'}
              </button>
              <div className='feed-line'></div>
              <p className="feed-text-muted ">Created At: {new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        );
      })}
      {hasMore && (
        <button className="btn btn-primary" onClick={loadMoreFeedbacks}>
          Load More
        </button>
      )}
    </div>
    </div>
  );
  
};

export default Feedback;
