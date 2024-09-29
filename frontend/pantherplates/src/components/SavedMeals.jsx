import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUtensils, FaLeaf, FaAppleAlt, FaHeartbeat, FaAllergies, FaGlobe, FaSmile } from 'react-icons/fa';

const SavedMeals = ({ userName }) => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null); // For modal

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
        setMeals(response.data);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };
    fetchMeals();
  }, [userName]);

  // Open modal
  const openMealModal = (meal) => {
    setSelectedMeal(meal);
  };

  // Close modal
  const closeMealModal = () => {
    setSelectedMeal(null);
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">{userName}'s Saved Meals</h2>

        {meals.length === 0 ? (
          <p className="text-center text-gray-600">No saved meals found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((mealItem) => (
              <div
                key={mealItem._id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => openMealModal(mealItem)}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{mealItem.meal.name}</h3>
                <p className="text-gray-700 mb-3 line-clamp-2">{mealItem.meal.description}</p>
                
                <h4 className="text-md font-semibold text-gray-800 mb-1">Ingredients</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  {mealItem.meal.ingredients.slice(0, 3).map((ingredient, index) => (
                    <li key={index} className="text-gray-600">{ingredient}</li>
                  ))}
                  {mealItem.meal.ingredients.length > 3 && (
                    <li className="text-gray-600">+ more...</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
{selectedMeal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    onClick={closeMealModal} // Allow exit by clicking outside
  >
    {/* Modal Card */}
    <div
      className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
    >
      <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-2xl font-bold">{selectedMeal.meal.name}</h2> */}
        <button className="text-red-500" onClick={closeMealModal}>
          ✖
        </button>
      </div>

      <div className="p-4 overflow-y-auto">
        <div className="bg-[#081E3F] bg-opacity-90 p-6 rounded-lg shadow-lg">
          {/* Meal Name */}
          <h3 className="text-xl text-left font-semibold text-gray-100 mb-2">
            {selectedMeal.meal.name}
          </h3>

          {/* Meal Description */}
          <p className="text-left text-gray-300 mb-6">
            {selectedMeal.meal.description}
          </p>

          {/* Ingredients Section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-green-400 flex items-center mb-2">
              <FaLeaf className="mr-2" />
              Ingredients:
            </h4>
            <ul className="flex flex-wrap mb-4">
              {selectedMeal.meal.ingredients.map((ingredient, index) => (
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
              {selectedMeal.health_conditions && selectedMeal.health_conditions.length > 0 && (
                <div className="flex items-start">
                  <FaHeartbeat className="text-red-500 mt-1 mr-3" />
                  <div>
                    <h5 className="text-md font-semibold text-gray-100">
                      This meal is safe for those with:
                    </h5>
                    <ul className="text-left list-disc list-inside text-gray-300">
                      {selectedMeal.health_conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Allergens */}
              {selectedMeal.allergens && selectedMeal.allergens.length > 0 && (
                <div className="flex items-start">
                  <FaAllergies className="text-yellow-500 mt-1 mr-3" />
                  <div>
                    <h5 className="text-md font-semibold text-gray-100">
                      This meal is safe for these allergens:
                    </h5>
                    <ul className="list-disc list-inside text-gray-300">
                      {selectedMeal.allergens.map((allergen, index) => (
                        <li className="text-left" key={index}>
                          {allergen}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Dietary Restrictions */}
              {selectedMeal.dietary_restrictions && selectedMeal.dietary_restrictions.length > 0 && (
                <div className="flex items-start">
                  <FaGlobe className="mr-2 text-green-400" />
                  <div>
                    <h5 className="text-md font-semibold text-gray-100">
                      This meal considers these cultural and personal choices:
                    </h5>
                    <ul className="list-disc list-inside text-gray-300">
                      {selectedMeal.dietary_restrictions.map((restriction, index) => (
                        <li className="text-left" key={index}>
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* General Preferences */}
              {selectedMeal.general_preferences && selectedMeal.general_preferences.length > 0 && (
                <div className="flex items-start">
                  <FaSmile className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h5 className="text-md font-semibold text-gray-100">
                      This meal accounts for your preferences:
                    </h5>
                    <ul className="list-disc list-inside text-gray-300">
                      {selectedMeal.general_preferences.map((preference, index) => (
                        <li className="text-left" key={index}>
                          {preference}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SavedMeals;
