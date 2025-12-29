from database.db import get_db_connection

def get_all_articles():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM articles")
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows


def get_article_by_id(article_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM articles WHERE id = %s", (article_id,))
    row = cursor.fetchone()

    cursor.close()
    conn.close()

    return row


def create_article(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO articles (title, content) VALUES (%s, %s)",
        (data.get("title"), data.get("content"))
    )

    conn.commit()
    cursor.close()
    conn.close()


def update_article(article_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE articles SET title=%s, content=%s WHERE id=%s",
        (data.get("title"), data.get("content"), article_id)
    )

    conn.commit()
    cursor.close()
    conn.close()


def delete_article(article_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM articles WHERE id=%s", (article_id,))
    conn.commit()

    cursor.close()
    conn.close()
