import pickle

# Load models and vectorizer
with open("tfidf_vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("likes_model.pkl", "rb") as f:
    likes_model = pickle.load(f)

with open("retweets_model.pkl", "rb") as f:
    retweets_model = pickle.load(f)

with open("replies_model.pkl", "rb") as f:
    replies_model = pickle.load(f)

def predict_engagement(text):
    # Preprocess text
    X = vectorizer.transform([text])

    # Predict individual metrics
    predicted_likes = likes_model.predict(X)[0]
    predicted_retweets = retweets_model.predict(X)[0]
    predicted_replies = replies_model.predict(X)[0]

    # Engagement score: (or however you'd like to weight this)
    engagement_score = predicted_likes + predicted_retweets + predicted_replies

    return {
        "likes": round(predicted_likes),
        "retweets": round(predicted_retweets),
        "replies": round(predicted_replies),
        "engagement_score": round(engagement_score)
    }

# Example usage:
if __name__ == "__main__":
    sample_tweet = "gm wagmi"
    prediction = predict_engagement(sample_tweet)
    print("📊 Prediction:", prediction)
