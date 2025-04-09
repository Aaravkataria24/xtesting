import { useState } from 'react';
import { TweetInput } from './components/TweetInput';
import { MetricsDisplay } from './components/MetricsDisplay';
import { predictSingleTweet, predictSplitTest } from './utils/predictTweet';
import { Tweet, TweetMetrics } from './types';

type CombinedPrediction = {
  tweet1: TweetMetrics;
  tweet2?: TweetMetrics;
  winner: 1 | 2;
};

function App() {
  const [mode, setMode] = useState<'single' | 'split'>('split');
  const [tweet1, setTweet1] = useState<Tweet>({ content: '', metrics: {} as TweetMetrics });
  const [tweet2, setTweet2] = useState<Tweet>({ content: '', metrics: {} as TweetMetrics });
  const [prediction, setPrediction] = useState<CombinedPrediction | null>(null);

  const handlePredict = async () => {
    try {
      if (mode === 'single') {
        const inputContent = tweet1.content;
        const result = await predictSingleTweet(inputContent);

        const metrics1: TweetMetrics = {
          likes: result.likes ?? 0,
          retweets: result.retweets ?? 0,
          replies: result.replies ?? 0,
          engagementScore: result.engagementScore ?? 0,
        };

        const updatedTweet1 = { content: inputContent, metrics: metrics1 };
        setTweet1(updatedTweet1);
        setPrediction({
          tweet1: metrics1,
          winner: 1,
        });

        // Save to localStorage (optional for single mode)
        const saved = JSON.parse(localStorage.getItem('predictions') || '[]');
        localStorage.setItem(
          'predictions',
          JSON.stringify([
            {
              tweet1: updatedTweet1,
              result: { metrics1 },
              timestamp: Date.now(),
            },
            ...saved,
          ])
        );
      } else {
        const input1 = tweet1.content;
        const input2 = tweet2.content;

        const result = await predictSplitTest(input1, input2);

        const metrics1: TweetMetrics = {
          likes: result.prediction1?.likes ?? 0,
          retweets: result.prediction1?.retweets ?? 0,
          replies: result.prediction1?.replies ?? 0,
          engagementScore: result.prediction1?.engagementScore ?? 0,
        };

        const metrics2: TweetMetrics = {
          likes: result.prediction2?.likes ?? 0,
          retweets: result.prediction2?.retweets ?? 0,
          replies: result.prediction2?.replies ?? 0,
          engagementScore: result.prediction2?.engagementScore ?? 0,
        };

        const winner = result.winner === 'tweet1' ? 1 : 2;

        const updatedTweet1 = { content: input1, metrics: metrics1 };
        const updatedTweet2 = { content: input2, metrics: metrics2 };

        setTweet1(updatedTweet1);
        setTweet2(updatedTweet2);
        setPrediction({
          tweet1: metrics1,
          tweet2: metrics2,
          winner,
        });

        const saved = JSON.parse(localStorage.getItem('predictions') || '[]');
        localStorage.setItem(
          'predictions',
          JSON.stringify([
            {
              tweet1: updatedTweet1,
              tweet2: updatedTweet2,
              result: { metrics1, metrics2, winner },
              timestamp: Date.now(),
            },
            ...saved,
          ])
        );
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            TweetLab
          </h1>
          <p className="text-gray-400">Predict your tweet's performance before posting</p>
        </header>

        <div className="mb-8">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setMode('single')}
              className={`px-6 py-2 rounded-full ${
                mode === 'single' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-gray-800 text-gray-400'
              }`}
            >
              Single Tweet
            </button>
            <button
              onClick={() => setMode('split')}
              className={`px-6 py-2 rounded-full ${
                mode === 'split' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-gray-800 text-gray-400'
              }`}
            >
              Split Test
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl mb-4">Tweet Option 1</h2>
              <TweetInput
                onChange={(content) => setTweet1({ content, metrics: {} as TweetMetrics })}
                placeholder="Write your first tweet..."
              />
            </div>
            {mode === 'split' && (
              <div>
                <h2 className="text-xl mb-4">Tweet Option 2</h2>
                <TweetInput
                  onChange={(content) => setTweet2({ content, metrics: {} as TweetMetrics })}
                  placeholder="Write your second tweet..."
                />
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handlePredict}
              className="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full font-bold hover:opacity-90 transition-opacity"
              disabled={!tweet1.content || (mode === 'split' && !tweet2.content)}
            >
              Predict Performance
            </button>
          </div>
        </div>

        {prediction && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <MetricsDisplay metrics={prediction.tweet1} isWinner={prediction.winner === 1} />
            {mode === 'split' && prediction.tweet2 && (
              <MetricsDisplay metrics={prediction.tweet2} isWinner={prediction.winner === 2} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
