import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaList, FaUtensils, FaLeaf, FaAppleAlt, FaHeartbeat, FaAllergies, FaSmile, FaGlobe } from 'react-icons/fa';
import logo from '../Shellhacks.png';

const Dashboard = ({ userName, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [recentMeal, setRecentMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getRecentMeal();
    }, []);

    const getRecentMeal = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/users/meals/recent', { params: { username: userName } });
            if (response.status === 200) {
                setRecentMeal(response.data);
                console.log('Successfully fetched recent meal:', response.data);
            }
        }
        catch (error) {
            console.error('Error fetching recent meal:', error);
            setError('No recent meal to show');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gradient-to-l from-[#081E3F] to-[#B6862C]">
            {/* Left Side - Recent Meals */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex items-center mb-6">
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="h-20 w-20 mr-4" />
                    {/* Dashboard Title */}
                    <h2 className="text-4xl text-[#081E3F] font-bold">
                        {userName}'s Dashboard
                    </h2>
                </div>
                <div className="bg-[#081E3F] bg-opacity-90 p-6 rounded-lg shadow-lg">
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : recentMeal ? (
                        <div key={recentMeal._id}>
                            {/* Most Recent Meal Header */}
                            <h2 className="text-2xl flex items-center font-bold text-[#B6862C] mb-4">
                                <FaUtensils className="mr-2" />
                                Most Recent Meal
                            </h2>

                            {/* Meal Name */}
                            <h3 className="text-xl text-left font-semibold text-gray-100 mb-2">
                                {recentMeal.meal.name}
                            </h3>

                            {/* Meal Description */}
                            <p className="text-left text-gray-300 mb-6">
                                {recentMeal.meal.description}
                            </p>

                            {/* Ingredients Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-green-400 flex items-center mb-2">
                                    <FaLeaf className="mr-2" />
                                    Ingredients:
                                </h4>
                                <ul className="flex flex-wrap mb-4">
                                    {recentMeal.meal.ingredients.map((ingredient, index) => (
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
                                    {recentMeal.health_conditions && recentMeal.health_conditions.length > 0 && (
                                        <div className="flex items-start">
                                            <FaHeartbeat className="text-red-500 mt-1 mr-3" />
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-100">
                                                    This meal is safe for those with:
                                                </h5>
                                                <ul className="text-left list-disc list-inside text-gray-300">
                                                    {recentMeal.health_conditions.map((condition, index) => (
                                                        <li key={index}>{condition}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Allergens */}
                                    {recentMeal.allergens && recentMeal.allergens.length > 0 && (
                                        <div className="flex items-start">
                                            <FaAllergies className="text-yellow-500 mt-1 mr-3" />
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-100">
                                                    This meal is safe for these allergens:
                                                </h5>
                                                <ul className="list-disc list-inside text-gray-300">
                                                    {recentMeal.allergens.map((allergen, index) => (
                                                        <li className="text-left" key={index}>{allergen}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dietary Restrictions */}
                                    {recentMeal.dietary_restrictions && recentMeal.dietary_restrictions.length > 0 && (
                                        <div className="flex items-start">
                                            <FaGlobe className="mr-2 text-green-400" />
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-100">
                                                    This meal considers these cultural and personal choices:
                                                </h5>
                                                <ul className="list-disc list-inside text-gray-300">
                                                    {recentMeal.dietary_restrictions.map((restriction, index) => (
                                                        <li className="text-left" key={index}>{restriction}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* General Preferences */}
                                    {recentMeal.general_preferences && recentMeal.general_preferences.length > 0 && (
                                        <div className="flex items-start">
                                            <FaSmile className="text-green-500 mt-1 mr-3" />
                                            <div>
                                                <h5 className="text-md font-semibold text-gray-100">
                                                    This meal accounts for your preferences:
                                                </h5>
                                                <ul className="list-disc list-inside text-gray-300">
                                                    {recentMeal.general_preferences.map((preference, index) => (
                                                        <li className="text-left" key={index}>{preference}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    ) : (
                        <p className="text-gray-500">No recent meal found.</p>
                    )}
                </div>
            </div>

            {/* Right Side - Actions */}
            <div className="w-full md:w-1/5 bg-[#081E3F] shadow-lg p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-100">Actions</h2>
                
                {/* Create Meal Button */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/dashboard/create')}
                        className="bg-[#B6862C] text-white rounded-full p-2 w-full hover:bg-[#A76B1F] flex items-center justify-center"
                    >
                        <FaPlus className="mr-2" /> Create Meal
                    </button>
                </div>
                
                {/* View Your Meals Button */}
                <div>
                    <button
                        onClick={() => navigate('/dashboard/meals')}
                        className="bg-blue-500 text-white rounded-full p-2 w-full hover:bg-blue-600 flex items-center justify-center"
                    >
                        <FaList className="mr-2" /> View Your Meals
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
