from flask import Blueprint, request, jsonify
from models.article_model import *

article_bp = Blueprint("articles", __name__)

@article_bp.get("/articles")
def fetch_articles():
    return jsonify(get_all_articles())


@article_bp.get("/articles/<int:article_id>")
def fetch_single(article_id):
    article = get_article_by_id(article_id)
    if not article:
        return {"error": "Article not found"}, 404
    return jsonify(article)


@article_bp.post("/articles")
def add_article():
    create_article(request.json)
    return {"message": "Article created"}, 201


@article_bp.put("/articles/<int:article_id>")
def update(article_id):
    update_article(article_id, request.json)
    return {"message": "Article updated"}


@article_bp.delete("/articles/<int:article_id>")
def delete(article_id):
    delete_article(article_id)
    return {"message": "Article deleted"}
