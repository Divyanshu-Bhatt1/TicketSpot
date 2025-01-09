import React, { useState } from "react";
import "./css/ToggleComponent.css";
import EventCreation from "./EventCreation"
import Home from "./Home"
import ShowCompete from "./ShowCompete"
import NavBar from "./Navbar";

import Setting from "./Setting";


const ToggleComponent = () => {
  const [activeTab, setActiveTab] = useState("Museum");

  const renderContent = () => {
    switch (activeTab) {
      case "Museum":
        return <EventCreation/>;
      case "Analytics":
        return <Home/>;
      case "Competitors":
        return <ShowCompete />;
      case "Setting":
        return <Setting/>;  
      default:
        return null;
    }
  };

  return (
    <div>
    <NavBar/>
    <div className="toggle-container">
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${activeTab === "Museum" ? "active" : ""}`}
          onClick={() => setActiveTab("Museum")}
        >
          Museum Event 
        </button>
        <button
          className={`toggle-button ${activeTab === "Analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("Analytics")}
        >
          Analytics
        </button>
        <button
          className={`toggle-button ${activeTab === "Competitors" ? "active" : ""}`}
          onClick={() => setActiveTab("Competitors")}
        >
          Competitors
        </button>
        <button
          className={`toggle-button ${activeTab === "Setting" ? "active" : ""}`}
          onClick={() => setActiveTab("Setting")}
        >
          Setting 
        </button>
        
      </div>
      <div className="toggle-content">{renderContent()}</div>
    </div>
    </div>
  );
};


export default ToggleComponent;
