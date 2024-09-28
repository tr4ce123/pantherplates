from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from scraper import breakfast, lunch, dinner

MONGO_URI = os.getenv('MONGO_URI')
load_dotenv()

client = MongoClient(MONGO_URI)
db = client.get_database("pantherplates")
food_items = db.get_collection("food_items")
users_collection = db.get_collection("users")

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}}, methods=['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'])

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

if __name__ == '__main__':
    app.run(port=5000, debug=True)