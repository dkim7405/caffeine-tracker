import os
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
        db.cursor.execute(sql)
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
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
