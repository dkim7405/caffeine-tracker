from flask import Flask, jsonify, request
from flask_cors import CORS
from db_conn import db_conn

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

db = db_conn()

@app.route('/')
def home():
    db.connect()
    return "Server is running!"

@app.route('/drinks', methods=['GET'])
def get_drinks():
    sql = """
    SELECT * FROM dbo.fullDrinkView ORDER BY name
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


if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )