

import React, { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import "./css/productpage.css";
import Subtitle from "./subtitle.js";
import {
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaEye,
} from "react-icons/fa";
// import {  FaTimes } from 'react-icons/fa';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import Footer from './footer'
import Navbar from './Navbar'
import Booking from './booking.js'
// import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faPaperclip,
  faStar,
faPlus
} from "@fortawesome/free-solid-svg-icons";

import axios from 'axios'
import ImageForProductPage from "./ImageForProductPage";
import ImagePopup from "./ImageForProdPop";
import Feedback from "./Feedback.js";
const ProductPage = () => {
  const [width, setwidth] = useState(0);

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false); // State to toggle dropdown

  const toggleDescription = () => {
    setIsDescriptionOpen((prev) => !prev);
  };


  const [rating, setRating] = useState(0); // Final saved rating
  const [hoverRating, setHoverRating] = useState(0); // Temporary hover rating

  // Update hover rating based on current star hover
  const handleMouseEnter = (star) => {
    setHoverRating(star);
  };

  // Save the last hovered rating when the mouse leaves
  const handleMouseLeave = () => {
    setRating(hoverRating);
  };



  // const isMobile = window.innerWidth <= 768;
  // useEffect(() => {
  //   setwidth(window.innerWidth);
  //   setviewarrow(isMobile ? "none" : "block");
  // });
 

  // const fileInputRef = useRef(null);




  const [text, setText] = useState('');
  const maxCharacters = 500;
  const minCharacters = 0; // Change this if you have a specific minimum character requirement

  const handleTextChange = (e) => {
    if (e.target.value.length <= maxCharacters) {
      setText(e.target.value);
    }
  };

  const [isZoom,setIsZoom]=useState(false);
 

  const handleZoom=()=>{
    
    setIsZoom(!isZoom)

  }

  const [products,setProducts]=useState([])
  const [desc,setDesc]=useState()





  const [productData, setProductData] = useState(null); // State to store product data
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [error, setError] = useState(null);

// 6751fe2125aed26a52685575
useEffect(() => {
  const fetchProductData = async () => {
    try {
      setIsLoading(true); // Start loading
      setError(null); // Reset error state

      // Fetch product data from the backend
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/auth/products/${id}`,{withCredentials:true});
      
      if (response.status === 200) {
        console.log('Product data fetched successfully:', response.data.monument);
        setProductData(response.data.monument); // Set product data
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError(error?.response?.data?.msg || 'Failed to fetch product data.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  fetchProductData();
}, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!productData) {
    return <div>Product not found!</div>;
  }


  const handleSubmitReview = async () => {
    // e.preventDefault();

    // Validation
    if (!text.trim()) {
      setError("Review text cannot be empty.");
      return;
    }
    if (typeof rating !== "number" || rating < 1) {
      alert("Please provide a valid rating (minimum 1 star).");
      return;
    }

    setError(""); // Clear errors before making the API request

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/api/auth/reviews`,
        { text, rating:(rating+1),id},
        {withCredentials:true}
      );

      if (response.status === 200) {
        // setSuccess("Review submitted successfully!");
        alert("Review submitted successfully!")
        setText(""); // Clear the textarea
        setRating(0); // Reset the rating
        console.log(response.data)
      }
    } catch (error) {
      setError("Failed to submit review. Please try again later.");
      console.error("Error submitting review:", error);
    }
  };

  const category = "Cars";


  return (
    <>
    <Navbar/>
    
    <div className="prodP-Supreme">

      {isZoom &&<ImagePopup
           handleZoom={handleZoom}
           images={productData.imageUrl}
    />}

    


      <div className='product-page-cnt'>
        
          {/* <div className="product-page-sub-cnt"> */}
            <div className="product-page">
              <div className="product-content">
                
                

                {/* <div className="product-page-img-cont"> */}
          <div className="product-page-img-cont" >
           
              <ImageForProductPage
                handleZoom={handleZoom}
                images={productData.imageUrl}
               
              />
            {/* ))} */}
          </div>
        {/* </div> */}




                <div className="Prod_desc">
                  {/* <div className="prod-icons">
                    <div className="prod_left_icons">
                      <div className="prod_icon">
                        <FaUser
                          className="icons"
                          style={{
                            backgroundColor: "#DDECF7",
                            fontSize: "12px",
                          }}
                        />
                      </div>
                      <span>Private</span>
                    </div>
                    <div className="prod_right_icons">
                      <div className="prod_icon">
                        <FaClock
                          className="icons"
                          style={{ backgroundColor: "#DDECF7" }}
                        />
                      </div>
                      <span>3 months ago</span>
                      <div className="prod_icon">
                        <FaEye
                          className="icons"
                          style={{ backgroundColor: "#DDECF7" }}
                        />
                      </div>
                      <span>379 Views</span>
                    </div>
                  </div> */}

                  

                  <div className="Product-heading">
                    <h2 style={{ color: "#374B5C", fontSize: "25px" }}>
                    Museum Name: {productData.MonumentName}
                    </h2>
                  </div>

                  {/* <p className="Category">Category: {category}</p> */}

                  <div className="product-location">
                    <div className="Icon-l">
                      <FaMapMarkerAlt className="loc_icon" />
                    </div>
                    {`${productData.location.city} , ${productData.location.state} , ${productData.location.zipCode}`}{" "}
                    {/* <a href="" className="SeeMap-btn">
                      See map
                    </a> */}
                  </div>

                  <div className="prod-head-data-div">
                    <p className="prod-head-data"><span>Timing:</span> {productData.timing}</p>
                  </div>

                  <div className="prod-head-contact-div">
                    <span>Contact Us</span>
                    <div className="prod-head-contact-sub-div">
                    <div className='prod-head-contact-sub-div-ch'>
                    <span>email:</span> <p>{" "} {productData.email}</p>
                    </div>
                    <div className='prod-head-contact-sub-div-ch'>
                    <span>phone:</span> <p>{" "} {productData.contactNumber}</p>
                    </div>
                    </div>
                  </div>

                  {/* <div className="product-price">
                    <p className="Price">
                      <strong>₹3,500/Day</strong>
                    </p>
                  </div> */}
                  {/* <div className="price-period-div">
                    <p className="price-period">Price Per Day: ₹3,500/Day</p>
                  </div> */}


                  <div className="Loc-map">
                <Subtitle subtitle={'Location'} />
                </div>
                    <div className="map-div">
                     
                      <iframe
                        src={productData.iframe}
                        width="100%"
                        height="323"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map of Goa"
                      ></iframe>
                      
                    </div>
                 
                 
                 {/* Dropdown for Description */}
              <div className="product-description">
                <h3 style={{ marginTop: "20px" }}>Description</h3>
                <button
                  onClick={toggleDescription}
                  style={{
                    backgroundColor: "#faa935",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "15px",
                  }}
                >
                  {isDescriptionOpen ? "Hide Description" : "Show Description"}
                </button>

                {isDescriptionOpen && (
                  <div>
                   
                      <div  style={{ marginBottom: "20px",textAlign:'justify' }}>
                       
                        <p>{productData.desc}</p>
                      </div>
                    
                    
                   
                  </div>
                )}
              </div>
              </div>


                    

                 
                </div>
             
             

              
            </div>
          </div>
  
                 
                 <div className="newReview">
                 <Subtitle subtitle={'Write a review'} />
                 
                    <div className="Ratings">
                    <div className="profile-section-cont">
                      <div className="profile-section">
                        <FaUser
                          style={{
                            fontSize: "30px",
                            color: "#374B5C",
                            marginRight: "10px",
                          }}
                        />
                      </div>

                      <p>
                        <b>Me</b>
                        <br></br>
                        Your opinion matters
                      </p>
                      
                      </div>
                      

                      {/* Rating */}
                      <div className="rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: 'pointer',
              color: star <= (hoverRating || rating) ? '#E9E017' : '#ccc',
            }}
          >
            <FontAwesomeIcon icon={faStar}  style={{height:'24px',width:'24px'}}/>
          </span>
        ))}
      </div>
                    </div>

                    <div className="review-form">
                     
   
                      
                      <textarea
                        placeholder="Write your review"
                        maxLength="500"
                        className="Rev_txt"
                        value={text}
                       onChange={handleTextChange}
                      ></textarea>
                       <div className="character-info">
        <span className={`min-characters ${text.length >= minCharacters ? 'valid' : ''}`}>
          Minimum characters: {minCharacters} 
        </span>
        <span className="character-count">
          {text.length}/{maxCharacters} characters
        </span>
      </div>
                      <button type="submit" onClick={handleSubmitReview} className="submit-rev-btn"><span>Submit Review</span> <FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                 
                  </div>

                  <Feedback id={id}/>
         
         
    </div>
    {/* {productData && productData!==null && <Booking productData={productData}/>} */}
       <Footer/>
    </>

  );
};       

export default ProductPage;