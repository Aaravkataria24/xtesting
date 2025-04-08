import pandas as pd

# Load the cleaned tweets CSV
df = pd.read_csv("cleaned_tweets.csv")

# Keep only the relevant columns: text, likes, replies, retweets
df = df[["text", "like_count", "reply_count", "retweet_count"]]

# Optional: Rename columns for clarity
df.columns = ["text", "likes", "replies", "retweets"]

# Save prepared dataset
df.to_csv("prepared_dataset.csv", index=False)

print("✅ Dataset prepared and saved as 'prepared_dataset.csv'")
