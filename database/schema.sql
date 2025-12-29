CREATE DATABASE beyondchats;

USE beyondchats;

CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    link TEXT UNIQUE,
    author VARCHAR(100),
    published_date VARCHAR(50),
    content LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
