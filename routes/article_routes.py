from flask import Blueprint, request, jsonify
from models.article_model import *

article_bp = Blueprint("articles", __name__)

@article_bp.get("/articles")
def fetch_articles():
    try:
        data = get_all_articles()
        return jsonify(data)
    except Exception as e:
        print("ERROR IN /articles:", str(e))  # 👈 forces log output
        return {"error": str(e)}, 500


@article_bp.get("/articles/<int:article_id>")
def fetch_single(article_id):
    try:
        article = get_article_by_id(article_id)
        if not article:
            return {"error": "Article not found"}, 404
        return jsonify(article)
    except Exception as e:
        print("ERROR IN /articles/<id>:", str(e))
        return {"error": str(e)}, 500

