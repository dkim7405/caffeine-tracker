from flask import Flask, send_from_directory
from db_conn import db_conn

app = Flask(__name__)
db = db_conn()

@app.route('/')
def home():
    return "<h1>Welcome to the Flask App!</h1>"

if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )