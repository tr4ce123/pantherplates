import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateMeal = ({ userName }) => {
  const [mealTime, setMealTime] = useState('');
  const [allergens, setAllergens] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [dietaryChoices, setDietaryChoices] = useState('');
  const [generalPreferences, setGeneralPreferences] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [error, setError] = useState('');
  const [mealPlanData, setMealPlanData] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mealTime) {
      console.error('Meal time is required');
      return;
    }

    const mealData = {
      meal_time: mealTime,
      allergens: allergens.split(',').map((item) => item.trim()),
      health_conditions: healthConditions.split(',').map((item) => item.trim()),
      dietary_restrictions: dietaryChoices.split(',').map((item) => item.trim()),
      general_preferences: generalPreferences.split(',').map((item) => item.trim()),
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/meals/generate', mealData);
      setMealPlanData(response.data.meal_plan);
      setMealPlan(response.data.meal_plan);
      setError('');
    } catch (error) {
      console.error('Error creating meal plan:', error);
      setError('Failed to generate meal plan. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/meals/save', { 
        meal_plan: mealPlanData, username: userName, allergens: allergens, health_conditions: healthConditions, dietary_restrictions: dietaryChoices, general_preferences: generalPreferences
      });
      console.log('Meal plan saved successfully!');
      navigate('/dashboard/meals');
    } catch (error) {
      console.error('Error saving meal plan:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-l from-[#081E3F] to-[#B6862C] items-center justify-center p-8">
      <div className="bg-[#081E3F] bg-opacity-90 shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-[#B6862C] text-center mb-3">Create Your Meal Plan</h1>
        <p className="text-m font-bold text-white text-center mb-8>">
          Enter any allergies, health conditions, dietary choices, and personal preferences you have, even if they may seem uncommon. If you have 
          specific or "rare" needs, this website was made for you!!
        </p>

        <form onSubmit={handleSubmit}>
          {/* Meal Time Dropdown */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-[#B6862C] mb-2 text-left">
              What meal would you want a plan for?
            </label>
            <select
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="block appearance-none w-full p-4 pr-10 border border-[#B6862C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B6862C]"
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
            <label className="block text-lg font-semibold text-[#B6862C] mb-2 text-left">
              Do you have any allergies?
            </label>
            <input
              type="text"
              placeholder="Ex: Nuts, Shellfish, etc..."
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
              className="w-full p-4 border border-[#B6862C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B6862C]"
            />
          </div>

          {/* Health conditions input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-[#B6862C] mb-2 text-left">
              Do you have any health conditions?
            </label>
            <input
              type="text"
              placeholder="Ex: Celiac Disease, Lactose Intolerance, Diabetes, etc."
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
              className="w-full p-4 border border-[#B6862C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B6862C]"
            />
          </div>

          {/* Cultural or dietary choices input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-[#B6862C] mb-2 text-left">
              Any cultural or personal dietary choices?
            </label>
            <input
              type="text"
              placeholder="Ex: Halal, Vegan, Vegetarian, Dairy-free, Kosher, etc."
              value={dietaryChoices}
              onChange={(e) => setDietaryChoices(e.target.value)}
              className="w-full p-4 border border-[#B6862C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B6862C]"
            />
          </div>

          {/* Personal preferences input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-[#B6862C] mb-2 text-left">
              Any personal preference?
            </label>
            <input
              type="text"
              placeholder="Ex: Low Sodium, High in Vitamins, etc."
              value={generalPreferences}
              onChange={(e) => setGeneralPreferences(e.target.value)}
              className="w-full p-4 border border-[#B6862C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B6862C]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#B6862C] text-white py-3 rounded-full font-semibold hover:bg-[#A76B1F] transition duration-300"
          >
            Submit
          </button>
        </form>

        {/* Display meal plan result */}
        {mealPlan && (
          <div className="mt-8 p-4 border border-[#B6862C] rounded-lg bg-[#081E3F] bg-opacity-90 text-white">
            <h2 className="text-2xl font-bold text-[#B6862C]">Generated Meal Plan:</h2>
            <div>
              <h3 className="text-xl font-semibold mt-4">{mealPlan.name}</h3>

              <h4 className="text-lg font-semibold mt-4 text-green-400">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {mealPlan.ingredients &&
                  mealPlan.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
              </ul>

              <h4 className="text-lg font-semibold mt-4 text-green-400">Nutrition Information:</h4>
              <ul className="list-disc list-inside">
                {mealPlan.nutrition &&
                  Object.entries(mealPlan.nutrition).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
              </ul>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-[#B6862C] text-white py-3 rounded-full font-semibold hover:bg-[#A76B1F] transition mt-4"
            >
              Save
            </button>
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
