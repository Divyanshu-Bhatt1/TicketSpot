import React, { useState, useEffect } from "react";
import "./css/ImageForProdPop.css"; // Import CSS for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGreaterThan,
  faLessThan,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from "@fortawesome/free-solid-svg-icons";

const ImagePopup = ({ images, handleZoom }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomMore,setZoomMore]=useState(false)

  const handleZoomMore=()=>{
    setZoomMore(!zoomMore)
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="image-prodP-popup-overlay">
      <div className="image-prodP-popup-content">
        <img
          src={images[currentIndex]}
          alt={`Images ${currentIndex}`}
          className={`image-prodP-popup-image ${zoomMore ? "zoomed" : ""}`}
        />
      </div>

      <div className="zoom-inOut-cnt" onClick={handleZoomMore}>
       
           {!zoomMore ?(<FontAwesomeIcon className="zoom-inOut-btn" icon={faMagnifyingGlassPlus} />):
       
           (<FontAwesomeIcon className="zoom-inOut-btn" icon={faMagnifyingGlassMinus} />)}
       
      </div>

      <div className="image-prodP-img-cnt">
        {currentIndex+1}/{images.length}
      </div>
      <button
        className="image-prodP-close-btn"
        onClick={() => {
          handleZoom();
        }}
        style={{color:'white'}}
      >
        ✖
      </button>
      <button
        className="image-prodP-nav-btn image-prodP-prev-btn"
        onClick={prevImage}
      >
        <FontAwesomeIcon icon={faLessThan} />
      </button>
      <button
        className="image-prodP-nav-btn image-prodP-next-btn"
        onClick={nextImage}
      >
        <FontAwesomeIcon icon={faGreaterThan} />
      </button>
    </div>
  );
};

export default ImagePopup;
