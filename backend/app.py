from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from scraper import breakfast, lunch, dinner
from chat_service import generate_response
import certifi
ca_path = certifi.where()


MONGO_URI = os.getenv('MONGO_URI')
load_dotenv()

client = MongoClient(MONGO_URI, tlsCAFile=ca_path)
db = client.get_database("pantherplates")
food_items = db.get_collection("food_items")
users_collection = db.get_collection("users")
meals_collection = db.get_collection("meals")

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': 'http://localhost:5173'}})

# @app.route('/foods', methods=['GET'])
# def all():
#     """ Returns: all food items in the database """
#     try:
#         data = request.json

@app.route('/scrape-meals/breakfast', methods=['POST'])
def scrape_breakfast_meals():
    try:
        meals = breakfast()

        if not meals:
            return jsonify({'message': 'No meals found to add.'}), 404
        
        food_items.insert_many(meals)
        return jsonify({'message': 'Breakfast meals added successfully!'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
@app.route('/scrape-meals/lunch', methods=['POST'])
def scrape_lunch_meals():
    try:
        meals = lunch()

        if not meals:
            return jsonify({'message': 'No meals found to add.'}), 404
        
        food_items.insert_many(meals)
        return jsonify({'message': 'Lunch meals added successfully!'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    

@app.route('/scrape-meals/dinner', methods=['POST'])
def scrape_dinner_meals():
    try:
        meals = dinner()

        if not meals:
            return jsonify({'message': 'No meals found to add.'}), 404
        
        food_items.insert_many(meals)
        return jsonify({'message': 'Dinner meals added successfully!'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/scrape-meals/breakfast', methods=['DELETE'])
def delete_lunch_meals():
    try:
        food_items.delete_many({"meal": "breakfast"})
        return jsonify({'message': 'Lunch meals deleted successfully!'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/foods', methods=['POST'])
def create_food_item():
    data = request.json

    food_item = {
        'name': data['name'],
        'meal': data['meal'],
        'portion': data['portion'],
        'calories': data['calories'],
        'nutritional_info': data['nutritional_info'],
        'vegan': data['is_vegan'],
        'vegetarian': data['is_vegetarian'],
        'climate_friendly': data['is_climate']
    }
    food_items.insert_one(food_item)

    return jsonify({'message': 'Food Item added successfully!'}), 200


@app.route('/breakfast', methods=['GET'])
def get_breakfast():
    breakfast = food_items.find({"meal": "breakfast"})
    meals = [serialize_meal(meal) for meal in breakfast]
    return jsonify(meals), 200


@app.route('/lunch', methods=['GET'])
def get_lunch():
    lunch = food_items.find({"meal": "lunch"})
    meals = [serialize_meal(meal) for meal in lunch]
    return jsonify(meals), 200


@app.route('/dinner', methods=['GET'])
def get_dinner():
    dinner = food_items.find({"meal": "dinner"})
    meals = [serialize_meal(meal) for meal in dinner]
    return jsonify(meals), 200

@app.route('/vegan', methods=['GET'])
def get_vegan():
    vegan = food_items.find({"is_vegan": True})
    meals = [serialize_meal(meal) for meal in vegan]
    return jsonify(meals), 200

@app.route('/vegetarian', methods=['GET'])
def get_vegetarian():
    vegetarian = food_items.find({"is_vegetarian": True})
    meals = [serialize_meal(meal) for meal in vegetarian]
    return jsonify(meals), 200

@app.route('/climate-friendly', methods=['GET'])
def get_climate_friendly():
    climate_friendly = food_items.find({"is_climate": True})
    meals = [serialize_meal(meal) for meal in climate_friendly]
    return jsonify(meals), 200

# Helper function to serialize MongoDB documents, was giving an error before
def serialize_meal(meal):
    meal['_id'] = str(meal['_id'])
    return meal


## MEALS ROUTES
@app.route('/meals/generate', methods=['POST'])
def generate_meal():
    data = request.json
    meal_time = data.get('meal_time')
    allergens = data.get('allergens', [])
    health_conditions = data.get('health_conditions', [])
    dietary_restrictions = data.get('dietary_restrictions', [])
    general_preferences = data.get('general_preferences', [])

    # Fetch available food items for the specified meal time
    available_foods = list(food_items.find({'meal': meal_time}))

    prompt = construct_prompt(meal_time, allergens, health_conditions, dietary_restrictions, available_foods, general_preferences)

    meal_plan = generate_response(prompt)

    def title_case_items(items):
        return [item.title() for item in items]

    processed_health_conditions = title_case_items(health_conditions)
    processed_dietary_restrictions = title_case_items(dietary_restrictions)
    processed_general_preferences = title_case_items(general_preferences)
    processed_allergens = title_case_items(allergens)

    response = {
        'meal_plan': meal_plan,
        'health_conditions': processed_health_conditions,
        'dietary_restrictions': processed_dietary_restrictions,
        'general_preferences': processed_general_preferences,
        'allergens': processed_allergens
    }


    return jsonify(response), 200

def construct_prompt(meal_time, allergens, health_conditions, dietary_restrictions, available_foods, general_preferences):
    prompt = f"""
    You are a helpful assistant that creates meal plans for college students based on their dietary preferences and available ingredients.
    These ingredients are from a dining hall on campus and they aren't cooking their meals, you are just creating a meal for them with the given foods.

    Meal Time: {meal_time}
    Allergens to avoid: {', '.join(allergens) if allergens else 'None'}
    Health conditions: {', '.join(health_conditions) if health_conditions else 'None'}
    Dietary restrictions: {', '.join(dietary_restrictions) if dietary_restrictions else 'None'}
    General preferences: {', '.join(general_preferences) if general_preferences else 'None'}

    Available Ingredients:
    {available_foods}

    Please generate a meal plan for {meal_time} that meets the user's specifications and uses only the available ingredients listed above. The meal plan should be detailed and include only the ingredients provided. Do not include any ingredients not listed. You can use each ingredient more than once to make the meal filling enough, but make sure you add each portion to the total.

    Use the following format for the meal and only generate ONE MEAL:
    1. Name: Name of the meal
    2. Ingredients: List of ingredients used
    3. Description: Explain how the meal adheres to the user's needs based on allergens, health conditions, general preferences and dietary restrictions. Say this like you're talking to the user and be informative. Do not spend a lot of time describing the dish, instead focus on the user's needs.
    4. Nutrition: One list of all nutritional information for the meal including micronutrients and macronutrients. Do not list it for each ingredient, just the meal as a whole.

    Please provide the meal plan in the following JSON format:
    "name": "",
    "ingredients": [],
    "description": "",
    "nutrition": dict
    """
    return prompt


@app.route('/meals/save', methods=['POST'])
def save_meals():
    data = request.json

    saved_meal = {
        "username": data['username'],
        "dietary_restrictions": data['dietary_restrictions'],
        "allergens": data['allergens'],
        "health_conditions": data['health_conditions'],
        "general_preferences": data['general_preferences'],
        "meal": data['meal_plan'],
    }
    
    meals_collection.insert_one(saved_meal)
    return jsonify({'message': 'Meal added successfully!'}), 200

## USER ROUTES
@app.route('/signup', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']

    if not username or not password:
        return jsonify({'message': 'Please provide both username and password!'}), 400
    
    if users_collection.find_one({'username': username}):
        return jsonify({'message': f'User with {username} already exists!'}), 401
    
    user = {
        'username': username,
        'password': password
    }
    users_collection.insert_one(user)

    return jsonify({'message': 'User registered successfully!', "username": user["username"]}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    if not username or not password:
        return jsonify({'message': 'Please provide both username and password!'}), 400
    
    user = users_collection.find_one({'username': username, 'password': password})
    if not user:
        return jsonify({'message': 'Invalid credentials!'}), 401

    return jsonify({'message': 'User logged in successfully!', 'username': user['username']}), 200

@app.route('/users/meals', methods=['GET'])
def get_meals_for_user():
    username = request.args.get('username')

    user_meals = meals_collection.find({'username': username})
    meals = [serialize_meal(meal) for meal in user_meals]
    return jsonify(meals), 200

@app.route('/users/meals/recent', methods=['GET'])
def get_last_meal_for_user():
    username = request.args.get('username')

    user_meals_cursor = meals_collection.find({'username': username})
    user_meals = list(user_meals_cursor)

    last_meal = user_meals[-1]
    last_meal['_id'] = str(last_meal['_id'])

    return jsonify(last_meal), 200


if __name__ == '__main__':
    app.run(port=5000, debug=True)