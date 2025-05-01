import os
import json
import time
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

types = ["Chocolate Drink", "Coffee", "Energy Drink", "Nutritional Drink", "Other", "Soda", "Sports Drink", "Supplement", "Tea", "Water"]

client = OpenAI()

serving_size = []

for type in types:
    print(f"Processing: {type}")
    try:
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {
                    "role": "system",
                    "content": """
                    You are a knowledge assistant for nutritional and dietary data.
                    For the drink types, return a JSON object with the following structure for each one:
                    {
                        "drink_type": "<exact name provided by the user>",
                        "common_serving_sizes": [
                            {
                                "name": "<serving size label (e.g., 'Small')>",
                                "amount_ml": <amount in milliliters>,
                                "amount_oz": <amount in fluid ounces>
                            },
                            {
                                "name": "<serving size label (e.g., 'Medium')>",
                                "amount_ml": <amount in milliliters>,
                                "amount_oz": <amount in fluid ounces>
                            },
                            {
                                "name": "<serving size label (e.g., 'Large')>",
                                "amount_ml": <amount in milliliters>,
                                "amount_oz": <amount in fluid ounces>
                            },
                            ...
                        ]
                    }

                    Keep the drink_type exactly as inputted by the user.
                    Provide all of the common serving sizes typically used in commercial or home settings (e.g., coffee shops, beverage manufacturers).
                    Use widely accepted and reliable sources for serving sizes (e.g., standard coffee sizes, soda can/bottle sizes, etc.).
                    Convert ounces to milliliters accurately (1 fl oz ≈ 29.5735 ml).
                    If any field is unknown or unverifiable, use "N/A" for that field.
                    """
                },
                {
                    "role": "user",
                    "content": type
                }
            ],
            temperature=0.2,
            max_tokens=512
        )
        result = response.choices[0].message.content.strip()
        serving_size.append(json.loads(result))
    except Exception as e:
        print(f"Error processing {type}: {e}")
        serving_size.append({
            "drink_name": type,
            "manufacturer": "N/A",
            "location": "N/A",
            "website": "N/A"
        })

    time.sleep(1)

# Save results to new json
with open('serving_size.json', 'w') as out_file:
    json.dump(serving_size, out_file, indent=2)

print("Saved to serving_size.json")
