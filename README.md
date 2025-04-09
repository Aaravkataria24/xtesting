# TweetLab 🐦

A lightweight web app that predicts the performance of tweets using machine learning. Built with React + FastAPI.

🌐 **Live Site:** [xtesting.aaravkataria.com](https://xtesting.aaravkataria.com)

⚠️ **Note:** The backend is hosted on Render and may take ~1 minute to spin up if it's been inactive. Just wait a bit and re-try if the predictions fail initially.

---

## Features

- Predict how well a single tweet will perform (likes, replies, retweets, and engagement score).
- Split test two tweets and find out which one is likely to perform better.
- Clean, modern UI with instant feedback.

---

## Run Locally

### 1. Clone the Repository

```
bash
git clone https://github.com/YOUR_USERNAME/xtesting.git
cd xtesting
```

### 2. Install Frontend Dependencies
```
npm install
```
To start the frontend:
```
npm run dev
```

### 3. Set Up the Backend (FastAPI)
**Create & Activate a Virtual Environment**
```
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```
**Install backend dependencies**
```
pip install -r requirements.txt
```
**Start the Backend Server**
```
uvicorn main:app --reload
```
The backend will run at http://127.0.0.1:8000.

# Project Structure
```
xtesting/
├── main.py                  # FastAPI backend
├── requirements.txt         # Python dependencies
├── src/
│   ├── App.tsx              # React frontend
│   ├── components/          # TweetInput, MetricsDisplay
│   └── utils/predictTweet.ts # API calls
└── tfidf_vectorizer.pkl     # Vectorizer
    likes_model.pkl
    retweets_model.pkl
    replies_model.pkl
```
