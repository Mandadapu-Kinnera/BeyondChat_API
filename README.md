# BeyondChats Scraper

This project extends the original scraper with an AI-powered content updater and a modern React frontend.

## Prerequisites
- Node.js installed.
- Python installed (and `pip`).
- MySQL running (configured in `config.py`).
- Google Gemini API Key (configured in `phase2_node_updater/.env`).

## Setup & Running

### 1. Pahe 1: Backend (API)
Ensure the Python backend is running:
```bash
pip install -r requirements.txt
python app.py
```
API runs at `http://localhost:5000`.

### 2. Phase 2: Article Updater
Run the Node.js script to fetch articles, research them on the web, rewrite them using AI, and save the updated version.

```bash
cd phase2_node_updater
npm install hiding dependencies... (already done)
node updater.js
```
This script:
- Fetches articles from the API.
- Searches for references (with fallback).
- Generates an updated version (with fallback mock if API key fails).
- Publishes the new article back to the API.

### 3. Phase 3: Frontend (React)
A modern, responsive dashboard to view original and updated articles.

```bash
cd phase3_frontend
npm install
npm run dev
```
Access at `http://localhost:5173`.

## Features
- **Smart Updates**: Automatically finds relevant content and rewrites articles.
- **Reference Tracking**: Cites sources used for the update.
- **Premium UI**: Dark-themed, responsive card layout with hover effects.


## Data flow diagram / Architecture diagram

```
/assets
   └── beyondchats_architecture.png
```


## Live link for FrontEnd project
