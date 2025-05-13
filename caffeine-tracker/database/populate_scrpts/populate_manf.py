from db_conn import db_conn
import json
import os
from dotenv import load_dotenv
load_dotenv()

# Path to JSON file
json_path = os.path.join(os.path.dirname(__file__), "..", "data", "manufacturers_updated.json")

# Load JSON
with open(json_path, "r", encoding="utf-8") as f:
    manufacturer_list = json.load(f)

# Extract unique manufacturers
unique_manufacturers = {}

for item in manufacturer_list:
    if not isinstance(item, dict):
        continue  # Skip if not a dict

    name = item.get("manufacturer", "").strip()
    address = item.get("location", "").strip()
    website = item.get("website", "").strip()

    if name and name != "N/A" and name not in unique_manufacturers:
        unique_manufacturers[name] = {
            "name": name,
            "address": address if address != "N/A" else None,
            "website": website if website != "N/A" else None
        }

# Connect to database
db = db_conn(
    username=os.getenv('DB_USERNAME'),
    password=os.getenv('DB_PASSWORD')
)
db.connect()

# Insert only if manufacturer not already in table
stmt = """
    IF NOT EXISTS (
        SELECT 1 FROM Manufacturer WHERE name = ?
    )
    INSERT INTO Manufacturer (name, website, address)
    VALUES (?, ?, ?)
"""

try:
    for m in unique_manufacturers.values():
        db.cursor.execute(stmt, (m["name"], m["name"], m["website"], m["address"]))
    db.connection.commit()
    print("All unique manufacturers inserted successfully.")
except Exception as e:
    print(f"Error during insertion: {e}")
finally:
    db.close()
