import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaPlus,
  FaArrowLeft,
  FaUtensils,
  FaLeaf,
  FaAppleAlt,
  FaHeartbeat,
  FaAllergies,
  FaGlobe,
  FaSmile,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SavedMeals = ({ userName }) => {
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:5000/users/meals',
          { params: { username: userName } },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Process each meal to ensure fields are arrays
        const mealsData = response.data.map((mealItem) => {
          let data = mealItem;

          data.health_conditions = Array.isArray(data.health_conditions)
            ? data.health_conditions
            : data.health_conditions
            ? data.health_conditions.split(',').map((s) => s.trim())
            : [];

          data.allergens = Array.isArray(data.allergens)
            ? data.allergens
            : data.allergens
            ? data.allergens.split(',').map((s) => s.trim())
            : [];

          data.dietary_restrictions = Array.isArray(data.dietary_restrictions)
            ? data.dietary_restrictions
            : data.dietary_restrictions
            ? data.dietary_restrictions.split(',').map((s) => s.trim())
            : [];

          data.general_preferences = Array.isArray(data.general_preferences)
            ? data.general_preferences
            : data.general_preferences
            ? data.general_preferences.split(',').map((s) => s.trim())
            : [];

          return data;
        });

        setMeals(mealsData);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };
    fetchMeals();
  }, [userName]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-l from-[#081E3F] to-[#B6862C]">
      <div className="w-full md:w-1/5 bg-[#081E3F] bg-opacity-80 shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-100">Actions</h2>

        {/* Back to Dashboard Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white rounded-full p-2 w-full hover:bg-blue-600 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
        </div>

        {/* Create Meal Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/dashboard/create')}
            className="bg-[#B6862C] text-white rounded-full p-2 w-full hover:bg-[#A76B1F] flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Create Meal
          </button>
        </div>
      </div>

      {/* Left Side - Saved Meals */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center mb-6">
          {/* Title */}
          <h2 className="text-4xl text-[#081E3F] font-bold">
            {userName}'s Saved Meals
          </h2>
        </div>
        {meals.length === 0 ? (
          <p className="text-center text-gray-600">No saved meals found.</p>
        ) : (
          meals.map((mealItem) => (
            <div
              key={mealItem._id}
              className="bg-[#081E3F] bg-opacity-90 p-6 rounded-lg shadow-lg mb-6"
            >
              {/* Meal Name */}
              <h3 className="text-xl text-left font-semibold text-gray-100 mb-2">
                {mealItem.meal.name}
              </h3>

              {/* Meal Description */}
              <p className="text-left text-gray-300 mb-6">
                {mealItem.meal.description}
              </p>

              {/* Ingredients Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-green-400 flex items-center mb-2">
                  <FaLeaf className="mr-2" />
                  Ingredients:
                </h4>
                <ul className="flex flex-wrap mb-4">
                  {mealItem.meal.ingredients.map((ingredient, index) => (
                    <li
                      className="bg-[#081E3F] text-white rounded-full px-3 py-1 mr-2 mb-2 shadow-md transition-transform duration-200 ease-in-out hover:bg-[#B6862C] hover:scale-105 text-m"
                      key={index}
                    >
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* About Your Meal Section */}
              <div>
                <h4 className="text-lg font-semibold text-green-400 flex items-center mb-4">
                  <FaAppleAlt className="mr-2" />
                  How your meal caters to you
                </h4>

                <div className="space-y-6">
                  {/* Health Conditions */}
                  {mealItem.health_conditions &&
                    mealItem.health_conditions.length > 0 && (
                      <div className="flex items-start">
                        <FaHeartbeat className="text-red-500 mt-1 mr-3" />
                        <div>
                          <h5 className="text-md font-semibold text-gray-100">
                            This meal is safe for those with:
                          </h5>
                          <ul className="text-left list-disc list-inside text-gray-300">
                            {mealItem.health_conditions.map(
                              (condition, index) => (
                                <li key={index}>{condition}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {/* Allergens */}
                  {mealItem.allergens && mealItem.allergens.length > 0 && (
                    <div className="flex items-start">
                      <FaAllergies className="text-yellow-500 mt-1 mr-3" />
                      <div>
                        <h5 className="text-md font-semibold text-gray-100">
                          This meal is safe for these allergens:
                        </h5>
                        <ul className="list-disc list-inside text-gray-300">
                          {mealItem.allergens.map((allergen, index) => (
                            <li className="text-left" key={index}>
                              {allergen}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Dietary Restrictions */}
                  {mealItem.dietary_restrictions &&
                    mealItem.dietary_restrictions.length > 0 && (
                      <div className="flex items-start">
                        <FaGlobe className="mr-2 text-green-400" />
                        <div>
                          <h5 className="text-md font-semibold text-gray-100">
                            This meal considers these cultural and personal
                            choices:
                          </h5>
                          <ul className="list-disc list-inside text-gray-300">
                            {mealItem.dietary_restrictions.map(
                              (restriction, index) => (
                                <li className="text-left" key={index}>
                                  {restriction}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {/* General Preferences */}
                  {mealItem.general_preferences &&
                    mealItem.general_preferences.length > 0 && (
                      <div className="flex items-start">
                        <FaSmile className="text-green-500 mt-1 mr-3" />
                        <div>
                          <h5 className="text-md font-semibold text-gray-100">
                            This meal accounts for your preferences:
                          </h5>
                          <ul className="list-disc list-inside text-gray-300">
                            {mealItem.general_preferences.map(
                              (preference, index) => (
                                <li className="text-left" key={index}>
                                  {preference}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {/* Nutrition Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-green-400 flex items-center mb-2">
                      <FaUtensils className="mr-2" />
                      Nutrition:
                    </h4>
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {Object.entries(mealItem.meal.nutrition).map(
                          ([key, value], index) => (
                            <tr
                              key={key}
                              className={
                                index % 2 === 0
                                  ? 'bg-[#102A43]'
                                  : 'bg-[#243B53]'
                              }
                            >
                              <td className="font-medium text-gray-100 px-4 py-2 border-b border-gray-600">
                                {key}:
                              </td>
                              <td className="text-gray-300 px-4 py-2 border-b border-gray-600">
                                {value}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedMeals;
