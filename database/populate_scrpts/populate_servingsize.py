import os
import json
from db_conn import db_conn
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(__file__)

with open(os.path.join(BASE_DIR, "..", "data", "serving_size.json"), encoding="utf-8") as f:
    servingsizes = json.load(f)

db = db_conn(
    username=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD")
)
db.connect()

for sizes in servingsizes:
    drink_type = sizes['drink_type']

    # Insert or get DrinksType id
    try:
        db.cursor.execute(
            "SELECT id FROM DrinksType WHERE name = ?",
            (drink_type,)
        )
        row = db.cursor.fetchone()
        if row:
            drink_type_id = row[0]
        else:
            db.cursor.execute(
                "INSERT INTO DrinksType (name) VALUES (?)",
                (drink_type,)
            )
            db.connection.commit()

            db.cursor.execute(
                "SELECT id FROM DrinksType WHERE name = ?",
                (drink_type,)
            )
            drink_type_id = db.cursor.fetchone()[0]

        # Insert common serving sizes
        for serving in sizes['common_serving_sizes']:
            name = serving['name']
            amount_ml = serving['amount_ml']
            amount_oz = serving['amount_oz']

            # Skip if data is "N/A"
            if str(amount_ml).upper() == "N/A" or str(amount_oz).upper() == "N/A":
                continue

            try:
                db.cursor.execute(
                    """
                    INSERT INTO ServingSize (name, amount_ml, amount_oz, drinks_type_id)
                    VALUES (?, ?, ?, ?)
                    """,
                    (name, float(amount_ml), float(amount_oz), drink_type_id)
                )
                db.connection.commit()
            except Exception as e:
                print(f"Failed to insert serving size '{name}': {e}")

    except Exception as e:
        print(f"Error processing drink type '{drink_type}': {e}")

db.connection.commit()
db.close()
