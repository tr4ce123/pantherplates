import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SavedMeals = ({userName}) => {
  const [meals, setMeals] = useState([]);
  // const navigate = useNavigate();
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:5000/users/meals', { params: { username: userName } },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
          console.log(response.data);

        setMeals(response.data);
      }
      catch (error) {
        console.error('Error fetching meals:', error);
      }
    }
    fetchMeals();
  }, [userName]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-auto">
      {/* Main Content */}
      <div className="flex-1 bg-white p-8">
        <h2 className="text-4xl font-bold mb-6 text-left">{userName}'s Saved Meals</h2>
        {meals.length === 0 ? (
          <p>No saved meals found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meals.map((mealItem) => (
              <div key={mealItem._id} className="border rounded-lg p-4 shadow">
                <h3 className="text-2xl font-semibold mb-2">{mealItem.meal.name}</h3>
                <p className="text-gray-700 mb-4">{mealItem.meal.description}</p>
                <h4 className="font-semibold">Ingredients:</h4>
                <ul className="list-disc list-inside mb-4">
                  {mealItem.meal.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h4 className="font-semibold">Nutrition:</h4>
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(mealItem.meal.nutrition).map(([key, value]) => (
                      <tr key={key}>
                        <td className="font-medium">{key}:</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedMeals