from flask import Flask
from flask_cors import CORS
from routes.article_routes import article_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(article_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"status": "BeyondChats Blog API Running"}

if __name__ == "__main__":
    app.run(debug=True)
