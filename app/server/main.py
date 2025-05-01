from flask import Flask
from db_conn import db_conn

app = Flask(__name__)
db = db_conn()

@app.route('/')
def home():
    return "Server is running!"

if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )