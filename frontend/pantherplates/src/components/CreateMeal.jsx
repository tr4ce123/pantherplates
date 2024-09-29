import React from 'react';

const CreateMeal = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
        Create Your Meal Plan
      </h1>
  
        <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-left">
                What meal would you want a plan for?
            </label>
            <select className="block appearance-none w-full p-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#081E3F]">
                <option value="">Select</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
            </select>
        </div>
  
      {/* Allergies input */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2 text-left">
          Do you have any allergies?
        </label>
        <input
          type="text"
          placeholder="Ex: Nuts, Shellfish, etc..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#081E3F]"
        />
      </div>
  
      {/* Health conditions input */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2 text-left">
          Do you have any health conditions?
        </label>
        <input
          type="text"
          placeholder="Ex: Celiac Disease, Lactose Intolerance, Diabetes, etc."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#081E3F]"
        />
      </div>
  
      {/* Cultural or dietary choices input */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2 text-left">
          Any cultural or personal dietary choices?
        </label>
        <input
          type="text"
          placeholder="Ex: Halal, Vegan, Vegetarian, Dairy-free, Kosher, etc."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#081E3F]"
        />
      </div>
  
      {/* Submit Button */}
      <button className="w-full bg-[#081E3F] text-white py-3 rounded-lg hover:bg-[#0A244F] transition duration-300">
        Submit
      </button>
    </div>
  </div>  
  );
};

export default CreateMeal;
