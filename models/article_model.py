from database.db import get_db_connection

def get_all_articles():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM articles")
    data = cursor.fetchall()
    conn.close()
    return data


def get_article_by_id(article_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM articles WHERE id=%s", (article_id,))
    article = cursor.fetchone()
    conn.close()
    return article


def create_article(data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO articles (title, link, author, published_date, content)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        data["title"],
        data["link"],
        data.get("author"),
        data.get("published_date"),
        data.get("content")
    ))
    conn.commit()
    conn.close()


def update_article(article_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE articles
        SET title=%s, link=%s, author=%s, published_date=%s, content=%s
        WHERE id=%s
    """, (
        data["title"],
        data["link"],
        data.get("author"),
        data.get("published_date"),
        data.get("content"),
        article_id
    ))
    conn.commit()
    conn.close()


def delete_article(article_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM articles WHERE id=%s", (article_id,))
    conn.commit()
    conn.close()
