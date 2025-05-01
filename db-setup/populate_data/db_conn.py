# pip install pypyodbc

import pypyodbc as odbc

class db_conn:
    def __init__(
        self,
        username: str,
        password: str,
        driver_name: str = 'SQL Server',
        server_name: str = 'golem',
        database_name: str = 'FinalProject_S1G6'
    ):
        self.username = username
        self.password = password
        self.driver_name = driver_name
        self.server_name = server_name
        self.database_name = database_name

        if (self.username == None or self.password == None):
            raise ValueError("Username and password cannot be NULL.")
        
        self.connection = None
        self.cursor = None
    
    def connect(self):
        connection_string = f"""
            DRIVER={{{self.driver_name}}};
            SERVER={self.server_name};
            DATABASE={self.database_name};
            UID={self.username};
            PWD={self.password};
        """
        
        try:
            self.connection = odbc.connect(connection_string)
            self.cursor = self.connection.cursor()
            print("Connected to the database successfully.")
        except odbc.DatabaseError as e:
            print(f"Database connection error: {e}")
    
    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        print("Database connection closed.")
        