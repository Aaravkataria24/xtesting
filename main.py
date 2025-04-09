from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np
import uvicorn
from fastapi.middleware.cors import CORSMiddleware 

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",           # for local development
        "https://xtester.netlify.app"      # for deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TweetInput(BaseModel):
    text: str

class SplitTestInput(BaseModel):
    tweet1: str
    tweet2: str

def predict_metrics(text):
    X = vectorizer.transform([text])
    likes = int(likes_model.predict(X)[0])
    retweets = int(retweets_model.predict(X)[0])
    replies = int(replies_model.predict(X)[0])
    engagement_score = likes + retweets + replies
    return {
        "likes": likes,
        "retweets": retweets,
        "replies": replies,
        "engagement_score": engagement_score
    }

@app.post("/predict/single")
def single_prediction(input: TweetInput):
    try:
        result = predict_metrics(input.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
        raise HTTPException(status_code=500, detail=str(e))

# For local testing
if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
