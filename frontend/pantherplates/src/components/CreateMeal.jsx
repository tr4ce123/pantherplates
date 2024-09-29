import React, { useState } from 'react';
import axios from 'axios';

const CreateMeal = () => {
  const [mealTime, setMealTime] = useState('');
  const [allergens, setAllergens] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [dietaryChoices, setDietaryChoices] = useState('');
  const [generalPreferances, setGeneralPreferances] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Check if form submission is triggered

    if (!mealTime) {
      console.error('Meal time is required');
      return;
    }

    const mealData = {
      meal_time: mealTime,
      allergens: allergens.split(',').map(item => item.trim()),
      health_conditions: healthConditions.split(',').map(item => item.trim()),
      dietary_restrictions: dietaryChoices.split(',').map(item => item.trim()),
      general_preferences: generalPreferances.split(',').map(item => item.trim())
    };

    try {
      const response = await axios.post('http://localhost:5000/meals/generate', mealData);
      setMealPlan(response.data.meal_plan);
      setError('');
    } catch (error) {
      console.error('Error creating meal plan:', error);
      setError('Failed to generate meal plan. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Create Your Meal Plan
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Meal Time Dropdown */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-left">
              What meal would you want a plan for?
            </label>
            <select
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="block appearance-none w-full p-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#081E3F]"
              required
            >
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
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
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
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
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
              value={dietaryChoices}
              onChange={(e) => setDietaryChoices(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#081E3F]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2 text-left">
              Any personal preference?
            </label>
            <input
              type="text"
              placeholder="Ex: Low Sodium, High in Vitamins etc."
              value={generalPreferances}
              onChange={(e) => setGeneralPreferances(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#081E3F]"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-[#081E3F] text-white py-3 rounded-full-lg hover:bg-[#0A244F] transition duration-300">
            Submit
          </button>
        </form>

        {/* Display meal plan result */}
        {mealPlan && (
          <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Generated Meal Plan:</h2>
            <p>{mealPlan}</p>
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="mt-4 p-4 border border-red-300 text-red-700 rounded-lg bg-red-100">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeal;
