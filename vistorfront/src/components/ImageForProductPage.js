import React, { useEffect, useState } from "react";
import "./css/imageForProductPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-regular-svg-icons";

const ImageForProductPage = ({ images,handleZoom}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  


  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="prod-page-img-sub-cont">
      <button
        className="product-page-img-arrow-btn left"
        onClick={handlePrevClick}
      >
        &larr;
      </button>
      <div className="slider-wrapper">
        <div
          className="image-slider"
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`image-${index}`}
              className={`slider-image`}
            />
          ))}
        </div>
      </div>
      <button
        className="product-page-img-arrow-btn right"
        onClick={handleNextClick}
      >
        &rarr;
      </button>

      <div className="pge-cnt">
         {currentImageIndex+1}/{images.length}
      </div>

      <div className="zoomo-cnt" onClick={()=>{handleZoom()}}>
             <FontAwesomeIcon icon={faSquare} />
      </div>

    </div>
  );
};

export default ImageForProductPage;
