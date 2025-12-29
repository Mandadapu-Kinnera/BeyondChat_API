import sys
import os
import requests
from bs4 import BeautifulSoup


ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT_DIR)

from database.db import get_db_connection


BASE_URL = "https://beyondchats.com/blogs-2/page/"
START_PAGE = 15
REQUIRED_COUNT = 5


def scrape_and_store():
    collected = []
    page = START_PAGE

    while len(collected) < REQUIRED_COUNT and page > 0:
        url = f"{BASE_URL}{page}/"
        print(f"🔍 Fetching page {page}")

        response = requests.get(url, timeout=15)
        if response.status_code != 200:
            page -= 1
            continue

        soup = BeautifulSoup(response.text, "html.parser")
        posts = soup.find_all("article")

        for post in posts:
            if len(collected) >= REQUIRED_COUNT:
                break

            title_tag = post.find("h2")
            link_tag = post.find("a")

            if not title_tag or not link_tag:
                continue

            title = title_tag.get_text(strip=True)
            link = link_tag.get("href")

            collected.append((title, link))

        page -= 1

    if not collected:
        print("❌ No articles found.")
        return

    conn = get_db_connection()
    cursor = conn.cursor()

    for title, link in collected:
        try:
            article_page = requests.get(link, timeout=15)
            article_soup = BeautifulSoup(article_page.text, "html.parser")

            content_div = article_soup.find(class_="blog-content")
            content = content_div.get_text("\n", strip=True) if content_div else ""

            cursor.execute("""
                INSERT IGNORE INTO articles
                (title, link, author, published_date, content)
                VALUES (%s, %s, %s, %s, %s)
            """, (title, link, None, None, content))

            print(f"✅ Saved: {title}")

        except Exception as e:
            print("❌ Error saving article:", e)

    conn.commit()
    cursor.close()
    conn.close()

    print("✅ Successfully stored 5 oldest articles")


if __name__ == "__main__":
    scrape_and_store()
