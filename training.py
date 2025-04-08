import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Load cleaned tweet data
df = pd.read_csv("prepared_dataset.csv")

# Text and targets
X_text = df["text"]
y_likes = df["likes"]
y_retweets = df["retweets"]
y_replies = df["replies"]

# TF-IDF vectorization
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(X_text)

# Train models
likes_model = LinearRegression().fit(X, y_likes)
retweets_model = LinearRegression().fit(X, y_retweets)
replies_model = LinearRegression().fit(X, y_replies)

# Evaluate
print("MSE - Likes:", mean_squared_error(y_likes, likes_model.predict(X)))
print("MSE - Retweets:", mean_squared_error(y_retweets, retweets_model.predict(X)))
print("MSE - Replies:", mean_squared_error(y_replies, replies_model.predict(X)))

# Save models and vectorizer properly
with open("tfidf_vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("likes_model.pkl", "wb") as f:
    pickle.dump(likes_model, f)

with open("retweets_model.pkl", "wb") as f:
    pickle.dump(retweets_model, f)

with open("replies_model.pkl", "wb") as f:
    pickle.dump(replies_model, f)

print("✅ All models and vectorizer saved correctly.")
