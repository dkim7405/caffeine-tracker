import os
import json
from db_conn import db_conn
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(__file__)

with open(os.path.join(BASE_DIR, "..", "data", "drinks_with_all_corrections.json"), encoding="utf-8") as f:
    drinks = json.load(f)

db = db_conn(
    username=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD")
)
db.connect()

# Fetch drinks from the database
db.cursor.execute("SELECT id, name FROM Drink")
rows1 = db.cursor.fetchall()

drinks_map = {}
for row in rows1:
    drink_id = row[0]
    name = row[1]
    drinks_map[name] = drink_id

# Fetch drink types from the database
db.cursor.execute("SELECT id, name FROM DrinksType")
rows2 = db.cursor.fetchall()

types_map = {}
for row in rows2:
    type_id = row[0]
    name = row[1]
    types_map[name] = type_id

stmt = """
    INSERT INTO HasDrinksType (drink_id, drinks_type_id)
    VALUES (?, ?)
"""

inserted = 0
skipped = 0 

for drink in drinks:
    if drink is None:
        continue

    name = drink.get("name", "").strip()
    dtype = drink.get("type", "").strip()

    drink_id = drinks_map.get(name)
    type_id = types_map.get(dtype)

    try:
        db.cursor.execute(stmt, (drink_id, type_id))
        inserted += 1
    except Exception as e:
        skipped += 1
        print(f"Skipped: Error inserting drink {name} with type {dtype}: {e}")

db.connection.commit()
db.close()

print(f"Inserted {inserted}")
print(f"Skipped {skipped}")
