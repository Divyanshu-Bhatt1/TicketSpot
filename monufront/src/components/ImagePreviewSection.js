import React, { useState } from "react";
import "./css/Setting.css";

const ImagePreviewSection = ({ imagePreviews }) => {
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentPreviewIndex((prevIndex) =>
      prevIndex === 0 ? imagePreviews.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentPreviewIndex((prevIndex) =>
      prevIndex === imagePreviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="image-preview-container">
      <button
        className="image-preview-arrow-btn left"
        onClick={handlePrevClick}
      >
        &larr;
      </button>
      <div className="slider-wrapper">
        <div
          className="image-preview-slider"
          style={{
            transform: `translateX(-${currentPreviewIndex * 100}%)`,
          }}
        >
          {imagePreviews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="image-preview"
            />
          ))}
        </div>
      </div>
      <button
        className="image-preview-arrow-btn right"
        onClick={handleNextClick}
      >
        &rarr;
      </button>

      <div className="image-preview-count">
        {currentPreviewIndex + 1}/{imagePreviews.length}
      </div>

    </div>
  );
};

export default ImagePreviewSection;
