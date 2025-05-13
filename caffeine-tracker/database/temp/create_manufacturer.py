import os
import json
import time
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(__file__)

client = OpenAI()

with open(os.path.join(BASE_DIR, "..", "data", "drinks_with_all_corrections.json"), encoding="utf-8") as f:
    drinks = json.load(f)

drink_names = []

for drink in drinks:
    if drink is not None:
        name = drink['name']
        drink_names.append(name)

manufacturer_data = []

for name in drink_names:
    print(f"Processing: {name}")
    try:
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {
                    "role": "system",
                    "content": """
                    For the caffeinated drinks, give me the following information in JSON format:
                    - drink_name
                    - manufacturer
                    - location
                    - website

                    Only include reliable, widely available information. If any field cannot be determined confidently, put "N/A".

                    Do not change the drink_name, it should be exactly as provided.

                    Response format:
                    {
                        "drink_name": "",
                        "manufacturer": "",
                        "location": "",
                        "website": ""
                    }
                    """
                },
                {
                    "role": "user",
                    "content": name
                }
            ],
            temperature=0.2,
            max_tokens=512
        )
        result = response.choices[0].message.content.strip()
        manufacturer_data.append(json.loads(result))
    except Exception as e:
        print(f"Error processing {name}: {e}")
        manufacturer_data.append({
            "drink_name": name,
            "manufacturer": "N/A",
            "location": "N/A",
            "website": "N/A"
        })

    time.sleep(1)

# Save results to new json
with open('manufacturers_updated.json', 'w') as out_file:
    json.dump(manufacturer_data, out_file, indent=2)

print("Saved to manufacturers_updated.json")
