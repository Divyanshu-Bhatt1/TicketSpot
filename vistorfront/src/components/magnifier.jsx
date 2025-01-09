import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Magnifier= () => {
  const [isActive, setIsActive] = useState(false);

  const toggleMagnifier = () => {
    setIsActive(!isActive);
    if (!isActive) {
      document.body.style.zoom = '150%';
    } else {
      document.body.style.zoom = '100%';
    }
  };

  return (
    <button
    onClick={toggleMagnifier}
    className="fixed bottom-4 left-4 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-200"
    aria-label="Toggle magnifier"
  >
    <Search size={24} />
  </button>
  
  );
};

export default Magnifier;

