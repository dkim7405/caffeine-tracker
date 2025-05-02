import os
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
    data = request.get_json()
    
    user_id = data.get('user_id')
    drink_id = data.get('drink_id')
    total_amount = data.get('total_amount')

    try:
        sql = """
        EXEC dbo.sp_insertAdd @userid = ?, @drinkid = ?, @totalamount = ?
        """
        db.cursor.execute(sql, [user_id, drink_id, total_amount])
        db.connection.commit()

        return jsonify({'message': 'Drink added successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )