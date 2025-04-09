from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np
import uvicorn

# Load vectorizer and models
with open("tfidf_vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("likes_model.pkl", "rb") as f:
    likes_model = pickle.load(f)

with open("retweets_model.pkl", "rb") as f:
    retweets_model = pickle.load(f)

with open("replies_model.pkl", "rb") as f:
    replies_model = pickle.load(f)

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",           # local dev
        "https://xtester.netlify.app",      # deployed frontend
        "https://xtesting.aaravkataria.com", # my website
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schemas
class TweetInput(BaseModel):
    text: str

class SplitTestInput(BaseModel):
    tweet1: str
    tweet2: str

# Prediction logic with logging
def predict_metrics(text):
    print(f"\n🔍 Predicting for tweet: {text}")
    X = vectorizer.transform([text])
    print(f"✅ TF-IDF vector shape: {X.shape}")

    likes = int(likes_model.predict(X)[0])
    retweets = int(retweets_model.predict(X)[0])
    replies = int(replies_model.predict(X)[0])
    engagement_score = likes + retweets + replies

    print(f"✅ Predicted - Likes: {likes}, Retweets: {retweets}, Replies: {replies}, Engagement Score: {engagement_score}")

    return {
        "likes": likes,
        "retweets": retweets,
        "replies": replies,
        "engagement_score": engagement_score
    }

# Single tweet prediction route
@app.post("/predict/single")
def single_prediction(input: TweetInput):
    try:
        result = predict_metrics(input.text)
        return { "prediction": result }
    except Exception as e:
        print(f"❌ Error in single_prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Split test prediction route
@app.post("/predict/split")
def split_test(input: SplitTestInput):
    try:
        result1 = predict_metrics(input.tweet1)
        result2 = predict_metrics(input.tweet2)

        winner = "tweet1" if result1["engagement_score"] > result2["engagement_score"] else "tweet2"

        return {
            "tweet1": result1,
            "tweet2": result2,
            "better_tweet": winner
        }
    except Exception as e:
        print(f"❌ Error in split_test: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Local testing
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
