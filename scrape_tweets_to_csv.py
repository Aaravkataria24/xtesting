import requests
import csv

# === CONFIG ===
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAGLV0QEAAAAAWdbXEKGdaEMd3VI96WNTvUdA27A%3Dje95y6ZGxRWuPvN1DTmv1DnYEwL4e7IQjrwMvyvd2PGoAeHy8P"  # Replace this
USERNAME = "TABASCOweb3"                # Replace if needed
CSV_FILENAME = "tabasco_tweets.csv"

# === HEADERS ===
HEADERS = {
    "Authorization": f"Bearer {BEARER_TOKEN}"
}

# === STEP 1: Get user ID from username ===
def get_user_id(username):
    url = f"https://api.twitter.com/2/users/by/username/{username}"
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()["data"]["id"]

# === STEP 2: Get latest tweets ===
def get_latest_tweets(user_id, max_results=100):
    url = f"https://api.twitter.com/2/users/{user_id}/tweets"
    params = {
        "max_results": max_results,
        "tweet.fields": "created_at,public_metrics"
    }
    resp = requests.get(url, headers=HEADERS, params=params)
    resp.raise_for_status()
    return resp.json()["data"]

# === STEP 3: Save to CSV ===
def save_to_csv(tweets, filename):
    if not tweets:
        print("No tweets found.")
        return

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "id", "text", "created_at", "retweet_count", "reply_count", "like_count", "quote_count"
        ])
        writer.writeheader()
        for tweet in tweets:
            metrics = tweet["public_metrics"]
            writer.writerow({
                "id": tweet["id"],
                "text": tweet["text"],
                "created_at": tweet["created_at"],
                "retweet_count": metrics["retweet_count"],
                "reply_count": metrics["reply_count"],
                "like_count": metrics["like_count"],
                "quote_count": metrics["quote_count"]
            })

# === MAIN ===
if __name__ == "__main__":
    user_id = get_user_id(USERNAME)
    tweets = get_latest_tweets(user_id)
    save_to_csv(tweets, CSV_FILENAME)
    print(f"✅ Done! Saved {len(tweets)} tweets to {CSV_FILENAME}")
