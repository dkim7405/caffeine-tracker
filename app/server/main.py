import os
import hashlib
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from db_conn import db_conn

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

db = db_conn()
db.connect()

@app.route('/')
def home():
    return "Server is running!"

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/drinks', methods=['GET'])
def get_drinks():
    sql = """
    SELECT * FROM dbo.Drink ORDER BY name
    """

    try:
        db.cursor.execute(sql)
        rows = db.cursor.fetchall()
        cols = [col[0] for col in db.cursor.description]

        return jsonify([
            dict(zip(cols, row)) for row in rows
        ])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



@app.route("/api/login", methods=["POST"])
def login():
    data = request.form
    username = data.get("username")
    password = data.get("password")

    try:
        db.cursor.execute("SELECT id FROM [User] WHERE username = ?", (username,))
        user_row = db.cursor.fetchone()
        if not user_row:
            return jsonify({"error": "Invalid username"}), 401

        user_id = user_row[0]

        db.cursor.execute("SELECT password_hash, salt FROM [Login] WHERE user_id = ?", (user_id,))
        row = db.cursor.fetchone()
        if not row:
            return jsonify({"error": "Login credentials not found"}), 401

        stored_hash, salt = row
        input_hash = hashlib.sha256((password + salt).encode()).hexdigest()

        if input_hash == stored_hash:
            return jsonify({"message": "Login successful"})
        else:
            return jsonify({"error": "Invalid password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/register", methods=["POST"])
def register():
    data = request.form
    username = data.get("username")
    password = data.get("password")
    salt = uuid.uuid4().hex
    password_hash = hashlib.sha256((password + salt).encode()).hexdigest()

    try:
        # Insert into User table
        db.cursor.execute("""
    INSERT INTO [User](username, first_name, middle_name, last_name, gender, body_weight, caffeine_limit, date_of_birth)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", (
    username,
    data.get("first_name"),
    data.get("middle_name"),
    data.get("last_name"),
    data.get("gender"),
    data.get("body_weight"),
    data.get("caffeine_limit"),
    data.get("date_of_birth")
))


        # Get user ID
        db.cursor.execute("SELECT id FROM [User] WHERE username = ?", (username,))
        user_id = db.cursor.fetchone()[0]

        # Insert into Login table
        db.cursor.execute("INSERT INTO [Login](user_id, password_hash, salt) VALUES (?, ?, ?)", (user_id, password_hash, salt))
        db.connection.commit()

        return jsonify({"message": "Registration successful"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    
if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )