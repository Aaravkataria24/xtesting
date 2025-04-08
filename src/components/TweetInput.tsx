import React, { useState } from 'react';
import { FaRegSmile, FaImage } from 'react-icons/fa';

interface TweetInputProps {
  onChange: (content: string) => void;
  placeholder?: string;
}

export const TweetInput: React.FC<TweetInputProps> = ({ onChange, placeholder }) => {
  const [content, setContent] = useState('');
  const maxChars = 280;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxChars) {
      setContent(newContent);
      onChange(newContent);
    }
  };

  return (
    <div className="tweet-card">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full bg-gray-700" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={handleChange}
            placeholder={placeholder || "What's happening?"}
            className="w-full bg-transparent border-none resize-none focus:ring-0 text-gray-100 placeholder-gray-500 text-xl min-h-[120px]"
          />
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex space-x-4 text-neon-blue">
              <button className="p-2 rounded-full hover:bg-blue-500/10">
                <FaImage className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-500/10">
                <FaRegSmile className="w-5 h-5" />
              </button>
            </div>
            <div className="text-gray-500">
              {content.length}/{maxChars}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};