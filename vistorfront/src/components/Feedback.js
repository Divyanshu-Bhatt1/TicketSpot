import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './css/Feedback.css';

const Feedback = ({id}) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [loadCount, setLoadCount] = useState(3); // Number of feedbacks to load initially
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalFeedbacks, setTotalFeedbacks] = useState(0); // Total number of feedbacks
  const [hasMore, setHasMore] = useState(true); // Flag to check if there are more feedbacks
  const [myId,setMyId]=useState(null)

  // Function to fetch feedback data from API
  const fetchFeedbackData = async () => {
    const limit = loadCount; // Number of feedbacks per page
    const page = currentPage; // Current page

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/auth/show-review?limit=${limit}&page=${page}&id=${id}`, { withCredentials: true });
      
      // If the current page is 1, reset the feedback data; otherwise, append the new feedbacks
      setFeedbackData((prevData) => (page === 1 ? response.data.reviews : [...prevData, ...response.data.reviews]));
      setMyId(response.data.userId)
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

  const handleDelete = async (feedId) => {
    console.log(feedId)
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/auth/delete-review?feedId=${feedId}`,{withCredentials:true}); // Adjust the API endpoint for deletion
        setFeedbackData(feedbackData.filter(feed => feed._id !== feedId));

        alert("Reveiw deleted successfully");
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  return (
    <div>
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
            <h5>{userName}{myId===feedback.userId?'(Me)':''}</h5>
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
              <div className='feed-text-trash-cont'>
              <p className="feed-text-muted ">Created At: {new Date(createdAt).toLocaleDateString()}</p>
              {myId===feedback.userId &&<div className="ev-show-del" onClick={()=>{handleDelete(feedback._id)}}>
                 <FontAwesomeIcon icon={faTrash} size="lg"  className='trash'/>
              </div>}
              </div>
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
