import React from "react";

const DateOptionsWidget = ({ dateOptions, actionProvider }) => {
  return (
    <div>
      {dateOptions.map((date, index) => (
        <button
          key={index}
          onClick={() => actionProvider.handleDateSelection(date)}
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: "#5ccc9d",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          {date}
        </button>
      ))}
    </div>
  );
};

export default DateOptionsWidget;
