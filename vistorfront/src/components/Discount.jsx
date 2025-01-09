import React from 'react';
import yourImage from './assets/LogoTicketspot.jpg'; // Adjust the path and filename as necessary

const DiscountCoupon = () => {
  return (
    <div
      className="flex justify-center items-center py-12 mt-12"
      style={{
        backgroundColor: 'var(--background-color)', // Using the background color variable
        zIndex: 10, // Add a higher z-index value
        position: 'relative', // Ensures z-index works
      }}
    >
      <div
        className="relative w-[900px] h-[200px] flex items-end justify-between border-dashed border-4 p-10 rounded-lg shadow-lg mt-12"
        style={{
          borderColor: 'var(--secondary-color)', // Using the secondary color for border
          backgroundColor: 'var(--background-color)', // Using background color variable
          zIndex: 20, // Ensures the coupon is above other elements
        }}
      >
        {/* Left Section */}
        <div
          className="flex flex-col justify-center items-center text-white h-full w-[120px] rounded-lg shadow-md"
          style={{
            backgroundColor: 'var(--primary-color)', // Using primary color for the background
          }}
        >
          <p className="text-xl font-bold">Rs 30 OFF</p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col items-center justify-center flex-grow pl-6">
          <p
            className="text-xl font-light mb-1 text-center"
            style={{ color: 'var(--background-color)' }} // Using heading color for text
          >
            Get Rs 30 discount on first booking
          </p>
          <p
            className="text-3xl font-bold text-center"
            style={{ color: 'var(--secondary-color)' }} // Using secondary color for coupon code
          >
            COUPON CODE - "WELCOME30"
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-shrink-0 w-[120px] h-[120px]">
          <img
            src={yourImage}
            alt="Coupon Decoration"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default DiscountCoupon;
