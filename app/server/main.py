from flask import Flask
from flask_cors import CORS
from db_conn import db_conn

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

db = db_conn()

@app.route('/')
def home():
    return "Server is running!"

if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )