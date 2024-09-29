import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../Shellhacks.png';

function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Navigate to the login page when the "Log In" button is clicked
    navigate('/login');
  };

  return (
    <div className="App">
      <div className="text-white">
        {/* Flex container for aligning the text and logo horizontally */}
        <div className="bg-gradient-to-r from-[#081E3F] to-[#B6862C] px-9 py-4 flex items-center justify-between w-screen h-screen">
          {/* Full-screen width and height with justified content */}
          
          {/* Left side: Text content, centered horizontally and vertically */}
          <div className="max-w-xl grid grid-cols-1 gap-8 mx-12">
            <h2 className="text-xl uppercase font-bold">Panther Plates</h2>
            <h1 className="text-6xl font-bold">Discover Your Perfect Meal</h1>
            <p className="text-lg">
              Tailored for FIU students, our app generates meal suggestions based on your personal preferences and dietary needs. Enjoy delicious and thoughtful meal options that fit your lifestyle!
            </p>
            <div>
              <button
                className="bg-gradient-to-r from-[#B6862C] py-3 px-6 text-lg rounded-md w-48"
                onClick={handleLoginClick} // Added onClick handler for routing
              >
                Log In
              </button>
            </div>
          </div>

          {/* Right side: Logo, centered vertically */}
          <div className="flex items-center justify-between mx-12">
            <img src={logo} alt="Shellhacks logo" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
