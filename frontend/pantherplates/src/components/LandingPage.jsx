import '../App.css';
import logo from '../Shellhacks.png';

function LandingPage() {
  return (
    <div className="App">
      <div className="text-white">
        {/* Flex container for aligning the text and logo horizontally */}
        <div className="bg-gradient-to-r from-[#081E3F] to-[#B6862C] px-8 py-4 flex items-center justify-between w-screen h-screen space-x-16"> 
          {/* Full-screen width and height with justified content */}
          
          {/* Left side: Text content, centered horizontally and vertically */}
          <div className="max-w-xl grid grid-cols-1 gap-8">
            <h2 className="text-xl uppercase font-bold">Panther Plates</h2>
            <h1 className="text-6xl font-bold">
              Discover Your Perfect Meal
            </h1>
            <p className="text-lg">
              Tailored for FIU students, our app generates meal suggestions based on your personal preferences and dietary needs. Enjoy delicious and thoughtful meal options that fit your lifestyle!
            </p>
            <button className="bg-gradient-to-r from-[#B6862C] py-3 px-6 text-lg rounded-md w-48">
              Generate Meal
            </button>
          </div>

          {/* Right side: Logo, centered vertically */}
          <div className="w-120 flex items-center justify-center">
            <img src={logo} alt="Shellhacks logo" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
