import React from "react";

const TextToSpeech = ({ text, language = "en-US" }) => {
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button 
      onClick={handleSpeak} 
      style={{
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Speak
    </button>
  );
};

export default TextToSpeech;