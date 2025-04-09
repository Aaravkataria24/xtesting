export interface Tweet {
  content: string;
  metrics: TweetMetrics;
}

export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
  engagementScore: number;
}

export interface PredictionResult {
  tweet1: TweetMetrics;
  tweet2?: TweetMetrics;
  winner: 1 | 2;
}
