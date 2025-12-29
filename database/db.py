import os
import mysql.connector
from urllib.parse import urlparse

def get_db_connection():
    mysql_url = os.getenv("MYSQL_URL")

    if mysql_url:
        url = urlparse(mysql_url)
        return mysql.connector.connect(
            host=url.hostname,
            user=url.username,
            password=url.password,
            database=url.path.lstrip("/"),
            port=url.port or 3306
        )

    # fallback to individual variables
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
