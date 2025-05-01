import json
import os
from db_conn import db_conn
from dotenv import load_dotenv
load_dotenv()

# Load JSON files
BASE_DIR = os.path.dirname(__file__)

with open(os.path.join(BASE_DIR, "..", "data", "manufacturers_updated.json"), encoding="utf-8") as f:
    manufacturers = json.load(f)

with open(os.path.join(BASE_DIR, "..", "data", "drinks_with_all_corrections.json"), encoding="utf-8") as f:
    drinks = json.load(f)

# Build mapping: drink_name → manufacturer_name
drink_to_manufacturer = {}
for entry in manufacturers:
    if isinstance(entry, dict):
        drink_name = entry.get("drink_name", "").strip()
        manufacturer = entry.get("manufacturer", "").strip()
        if drink_name and manufacturer and manufacturer != "N/A":
            drink_to_manufacturer[drink_name] = manufacturer

# Connect to DB
db = db_conn(
    username=os.getenv('DB_USERNAME'),
    password=os.getenv('DB_PASSWORD')
)
db.connect()

stmt = """
    INSERT INTO Drink (name, [mg/oz], image_url, manufacturer_id)
    VALUES (?, ?, ?, (
        SELECT id FROM Manufacturer WHERE name = ?
    ))
"""

inserted, skipped = 0, 0

try:
    for drink in drinks:
        if not isinstance(drink, dict):
            print("Skipped: Invalid drink entry (not a dict)")
            skipped += 1
            continue

        name = drink.get("name", "").strip()
        mg_per_oz = drink.get("mg_per_oz", None)
        image_url = drink.get("image", "").strip()

        # Skip if any missing
        if not name:
            print("Skipped: Missing drink name")
            skipped += 1
            continue
        if mg_per_oz is None:
            print(f"Skipped '{name}': Missing mg_per_oz")
            skipped += 1
            continue
        if not image_url:
            print(f"Skipped '{name}': Missing image_url")
            skipped += 1
            continue

        manufacturer_name = drink_to_manufacturer.get(name)

        try:
            db.cursor.execute(stmt, (name, float(mg_per_oz), image_url, manufacturer_name))
            inserted += 1
        except Exception as e:
            print(f"Error inserting '{name}': {e}")
            skipped += 1

    db.connection.commit()
    print(f"\nInserted: {inserted} drinks | Skipped: {skipped}")
except Exception as e:
    print(f"Critical error during batch insert: {e}")
finally:
    db.close()
