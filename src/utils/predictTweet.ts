export type PredictionResult = {
  likes: number;
  retweets: number;
  replies: number;
  engagementScore: number;
};

export type SplitTestResult = {
  prediction1: PredictionResult;
  prediction2: PredictionResult;
  winner: string;
};

export const predictSingleTweet = async (
  tweet: string
): Promise<PredictionResult> => {
  const response = await fetch('https://xtesting-api.onrender.com/predict/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // FIXED: FastAPI expects "text", not "tweet"
    body: JSON.stringify({ text: tweet }),
  });

  if (!response.ok) {
    throw new Error('Failed to predict tweet');
  }

  const data = await response.json();
  const { likes, retweets, replies, engagement_score } = data;

  return {
    likes,
    retweets,
    replies,
    engagementScore: engagement_score,
  };
};

export const predictSplitTest = async (
  tweet1: string,
  tweet2: string
): Promise<SplitTestResult> => {
  const response = await fetch('https://xtesting-api.onrender.com/predict/split', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tweet1, tweet2 }),
  });

  if (!response.ok) {
    throw new Error('Failed to predict split test');
  }

  const data = await response.json();
  const {
    tweet1: prediction1,
    tweet2: prediction2,
    better_tweet: winner,
  } = data;

  return {
    prediction1: {
      likes: prediction1.likes,
      retweets: prediction1.retweets,
      replies: prediction1.replies,
      engagementScore: prediction1.engagement_score,
    },
    prediction2: {
      likes: prediction2.likes,
      retweets: prediction2.retweets,
      replies: prediction2.replies,
      engagementScore: prediction2.engagement_score,
    },
    winner,
  };
};
