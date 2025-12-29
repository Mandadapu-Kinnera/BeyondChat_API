import os
import mysql.connector
from urllib.parse import urlparse

def get_db_connection():
    database_url = os.getenv("MYSQL_URL")

    if not database_url:
        raise Exception("MYSQL_URL not set")

    url = urlparse(database_url)

    return mysql.connector.connect(
        host=url.hostname,
        user=url.username,
        password=url.password,
        database=url.path.lstrip("/"),
        port=url.port
    )
