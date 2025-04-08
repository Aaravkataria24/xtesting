import React from 'react';
import { TweetMetrics } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MetricsDisplayProps {
  metrics: TweetMetrics;
  isWinner?: boolean;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics, isWinner }) => {
  const data = [
    { name: 'Likes', value: metrics.likes },
    { name: 'Replies', value: metrics.replies },
    { name: 'Retweets', value: metrics.retweets },
  ];

  return (
    <div className={`tweet-card ${isWinner ? 'neon-glow' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Predicted Performance</h3>
        {isWinner && (
          <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm">
            Winner 🏆
          </span>
        )}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
            />
            <Bar
              dataKey="value"
              fill={isWinner ? '#bc13fe' : '#00f7ff'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="text-center">
          <span className="text-2xl font-bold text-neon-blue">
            {metrics.engagementScore}
          </span>
          <p className="text-gray-400">Engagement Score</p>
        </div>
      </div>
    </div>
  );
};
