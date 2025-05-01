from flask import Flask, send_from_directory
from db_conn import db_conn

app = Flask(__name__, static_folder='../client/dist', static_url_path='/')
db = db_conn()

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )