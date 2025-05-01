import os
import json
from db_conn import db_conn
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(__file__)

with open(os.path.join(BASE_DIR, "..", "data", "drinks_with_all_corrections.json"), encoding="utf-8") as f:
    drinks = json.load(f)

drinks_types = set()
for drink in drinks:
    if drink is not None and "type" in drink and drink["type"] is not None:
        drinks_types.add(drink["type"].strip())

db = db_conn(
    username=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD")
)
db.connect()

stmt = """
    INSERT INTO DrinksType (name)
    VALUES (?)
"""

for drink_type in drinks_types:
    try:
        db.cursor.execute(stmt, (drink_type,))
    except Exception as e:
        print(f"Error inserting drink type {drink_type}: {e}")

db.connection.commit()
db.close()
print("Drink types inserted successfully.")