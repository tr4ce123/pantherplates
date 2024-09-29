import json
import os
import re
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.environ["OPENAI_KEY"])

def extract_json(text):
    try:
        # This regex attempts to find the first JSON object in the text
        json_str = re.search(r'\{.*\}', text, re.DOTALL).group()
        return json.loads(json_str)
    except (AttributeError, json.JSONDecodeError):
        return None

def generate_response(prompt):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
    )
    generated_text = response.choices[0].message.content.strip()
    meal_plan = extract_json(generated_text)

    return meal_plan
