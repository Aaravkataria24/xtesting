import pandas as pd

# Load the original CSV
df = pd.read_csv("tabasco_tweets.csv")

# Remove tweets with 0 likes
df = df[df["like_count"] > 0]

# Combine quote_count and retweet_count into a single column
df["retweet_count"] = df["retweet_count"] + df["quote_count"]

# Drop the quote_count column
df = df.drop(columns=["quote_count"])

# Save the cleaned data to a new CSV
df.to_csv("cleaned_tweets.csv", index=False)

print("Saved cleaned data to cleaned_tweets.csv")