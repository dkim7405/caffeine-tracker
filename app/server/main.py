import os
import uuid
import hashlib

from flask import Flask, jsonify, request
from flask_cors import CORS
from db_conn import db_conn
from datetime import datetime

app = Flask(__name__)
CORS(app)

db = db_conn()
db.connect()

@app.route('/')
def home():
    return "Server is running!" 

@app.route('/drinks', methods=['GET'])
def get_drinks():
    sql = "EXECUTE dbo.sp_getDrinks"
    try:
        db.cursor.execute("EXEC dbo.sp_getAllDrinks")
        rows = db.cursor.fetchall()
        cols = [col[0] for col in db.cursor.description]

        return jsonify([dict(zip(cols, row)) for row in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/drinks/<int:drink_id>', methods=['GET'])
def get_drink_details(drink_id):
    sql = "EXECUTE dbo.sp_getDrinkDetails @drinkid = ?"
    try:
        db.cursor.execute(sql, [drink_id])
        rows = db.cursor.fetchall()
        cols = [col[0] for col in db.cursor.description]

        if not rows:
            return jsonify({'error': 'Drink not found'}), 404
        
        return jsonify([dict(zip(cols, row)) for row in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/servingsizes/<string:drink_type>', methods=['GET'])
def get_serving_sizes(drink_type):
    sql = "EXECUTE dbo.sp_getServingSizes @drink_type_name = ?"
    try:
        db.cursor.execute(sql, [drink_type])
        rows = db.cursor.fetchall()
        cols = [col[0] for col in db.cursor.description]

        if not rows:
            return jsonify({'message': 'No serving sizes found'}), 404
        
        return jsonify([dict(zip(cols, row)) for row in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/users/<int:user_id>/adds', methods=['GET'])
def get_user_adds(user_id):
    sql = "EXECUTE dbo.sp_readAdd @userid = ?"
    try:
        db.cursor.execute(sql, [user_id])
        rows = db.cursor.fetchall()
        cols = [col[0] for col in db.cursor.description]

        result = []

        for row in rows:
            record = dict(zip(cols, row))
            time_added = record.get('time_added')

            if isinstance(time_added, datetime):
                # DateTime matching SQL Server format
                record['time_added'] = time_added.strftime('%Y-%m-%dT%H:%M:%S.%f')

            result.append(record)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/users/<int:user_id>/adds', methods=['POST'])
def add_drink(user_id):
    data = request.get_json()
    drink_id = data.get('drink_id')
    total_amount = data.get('total_amount')

    sql = "EXEC dbo.sp_insertAdd @userid = ?, @drinkid = ?, @totalamount = ?"

    try:
        db.cursor.execute(sql, [user_id, drink_id, total_amount])
        db.connection.commit()
        return jsonify({'message': 'Drink added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# path = allows slashes and punctuations
@app.route('/users/<int:user_id>/adds/<path:time_added>', methods=['PUT'])
def update_drink(user_id, time_added):
    data = request.get_json()
    new_drink_id = data.get('new_drink_id')
    new_total_amount = data.get('new_total_amount')

    if new_total_amount is None:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        # Expect ISO with full microseconds
        dt = datetime.strptime(time_added, '%Y-%m-%dT%H:%M:%S.%f')
    except ValueError:
        return jsonify({'error': 'Invalid datetime format'}), 400
    
    sql = "EXEC dbo.sp_updateAdd @userid = ?, @time_added = ?, @new_drinkid = ?, @new_totalamount = ?"

    try:
        db.cursor.execute(sql, [user_id, dt, new_drink_id, new_total_amount])
        db.connection.commit()
        return jsonify({'message': 'Drink updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    # path: allows slashes and punctuations
@app.route('/users/<int:user_id>/adds/<path:time_added>', methods=['DELETE'])
def delete_drink(user_id, time_added):
    try:
        dt = datetime.strptime(time_added, '%Y-%m-%dT%H:%M:%S.%f')
    except ValueError:
        return jsonify({'error': 'Invalid datetime format'}), 400
    
    sql = "EXEC dbo.sp_deleteAdd @userid = ?, @time_added = ?"

    try:
        db.cursor.execute(sql, [user_id, dt])
        db.connection.commit()
        return jsonify({'message': 'Drink deleted successfully'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        return jsonify({'error': str(e)}), 500

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
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
