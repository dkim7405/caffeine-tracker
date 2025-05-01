import compute_limit
import os
from db_conn import db_conn
from dotenv import load_dotenv
load_dotenv()

# replace <username> and <password>
db = db_conn(
    username=os.getenv('DB_USERNAME'),
    password=os.getenv('DB_PASSWORD')
)
db.connect()

# compute caffeine limit by weight & gender
# weight = 150, gender = 'M' by default
limit = compute_limit.compute_limit()

print(f"Computed limit: {limit}")

# raw sql execution
stmt = """
    INSERT INTO [User] (username, first_name, last_name, middle_name, gender, body_weight, caffeine_limit, date_of_birth)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
"""

params = ('testUser', 'testFirst', 'testLast', 'testMiddle', 'M', 150, limit, '2005-01-01')

db.cursor.execute(stmt, params)
# commit is required to save changes to the database
db.connection.commit()
print("Data inserted successfully.")
db.close()
