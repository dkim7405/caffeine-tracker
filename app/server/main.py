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

@app.route('/drinks', methods=['GET'])
def get_drinks():
    try:
        db.cursor.execute("EXEC dbo.sp_getAllDrinks")
        rows = db.cursor.fetchall()
        cols = [c[0] for c in db.cursor.description]
        return jsonify([dict(zip(cols, r)) for r in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


    
@app.route('/drinks/<int:drink_id>', methods=['GET'])
def get_drink_details(drink_id):
    sql = """
    EXECUTE dbo.sp_getDrinkDetails @drinkid = ?
    """

    try:
        db.cursor.execute(sql, [drink_id])
        rows = db.cursor.fetchall()
        cols = [col[0] for col in db.cursor.description]

        if not rows:
            return jsonify({'error': 'Drink not found'}), 404

        return jsonify([
            dict(zip(cols, row)) for row in rows
        ])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/servingsizes/<string:drink_type>', methods=['GET'])
def get_serving_sizes(drink_type):
    sql = """
    EXECUTE dbo.sp_getServingSizes @drink_type_name = ?
    """

    try:
        db.cursor.execute(sql, [drink_type])
        rows = db.cursor.fetchall()
        cols = [col[0] for col in db.cursor.description]

        if not rows:
            return jsonify({'message': 'No serving sizes found'}), 404

        return jsonify([dict(zip(cols, row)) for row in rows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/addDrink', methods=['POST'])
def add_drink():
    data = request.get_json(force=True)  
    uid  = data.get('user_id')
    did  = data.get('drink_id')
    amt  = data.get('total_amount')
    if not all([uid, did, amt]):
        return jsonify({'error': 'user_id, drink_id and total_amount are required'}), 400

    try:
        db.cursor.execute(
            "EXEC dbo.sp_insertAdd @userid = ?, @drinkid = ?, @totalamount = ?",
            [uid, did, amt]
        )
        db.connection.commit()

        return jsonify({'message': 'Drink added successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/api/login", methods=["POST"])
def login():
    data = request.form
    username = data.get("username")
    password = data.get("password")

    try:
        db.cursor.execute("EXEC dbo.sp_getLoginInfo @username = ?", (username,))
        row = db.cursor.fetchone()

        if not row:
            return jsonify({"error": "Invalid username"}), 401

        user_id, stored_hash, salt = row
        input_hash = hashlib.sha256((password + salt).encode()).hexdigest()

        if input_hash == stored_hash:
            return jsonify({"message": "Login successful", "userId": user_id})
        else:
            return jsonify({"error": "Invalid password"}), 401
    except Exception as e:
            return jsonify({"error": str(e)}), 500
    


@app.route("/api/register", methods=["POST"])
def register():
    data = request.form

    username = data.get("username")
    raw_pw   = data.get("password")
    if not username or not raw_pw:
        return jsonify({"error": "username & password required"}), 400

    salt    = uuid.uuid4().hex
    pw_hash = hashlib.sha256((raw_pw + salt).encode()).hexdigest()

    params = [
        username,                      
        pw_hash,                      
        salt,                     
        data.get("first_name"),     
        data.get("middle_name"),       
        data.get("last_name"),         
        data.get("gender"),          
        data.get("body_weight"),       
        data.get("caffeine_limit"),    
        data.get("date_of_birth")      
    ]

    try:
        db.cursor.execute(
            "EXEC dbo.sp_create_user ?,?,?,?,?,?,?,?,?,?",
            params
        )

        while db.cursor.description is None and db.cursor.nextset():
            pass
    
        row = db.cursor.fetchone()
        if not row or row[0] is None:
            db.connection.rollback()
            return jsonify({"error": "sp_create_user did not return an id"}), 500

        new_id = int(row[0])
        db.connection.commit()

        return jsonify({"message": "Registration successful",
                        "userId": new_id}), 201

    except Exception as e:
        db.connection.rollback()
        return jsonify({"error": str(e)}), 500





@app.route("/api/today-caffeine", methods=["GET"])
def today_caffeine():

    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    try:
  
        db.cursor.execute(
            "EXEC dbo.sp_getDailyCaffeine @userId = ?", 
            [user_id]
        )
        row = db.cursor.fetchone()     
        total = row[0] if row else 0

        return jsonify({"todayCaffeine": total})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )