import os
import mysql.connector

def get_db_connection():
    host = os.getenv("MYSQL_HOST")
    user = os.getenv("MYSQL_USER")
    password = os.getenv("MYSQL_PASSWORD")
    database = os.getenv("MYSQL_DATABASE")
    port = int(os.getenv("MYSQL_PORT", 3306))

    if not all([host, user, password, database]):
        raise Exception("Database environment variables not set")

    return mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        port=port
    )
