import React from 'react';
import type { ChatMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white self-end rounded-ss-xl rounded-e-xl'
    : 'bg-white text-gray-800 self-start rounded-se-xl rounded-s-xl border border-gray-200';

  const formattedText = () => {
    // Replace **text** with a styled <strong> tag to make equations stand out.
    // This provides a simple and safe way to add rich formatting.
    // The 'gs' flags ensure global replacement across multiple lines.
    const html = message.text.replace(
      /\*\*(.*?)\*\*/gs,
      '<strong class="font-bold text-lg text-blue-600">$1</strong>'
    );
    return { __html: html };
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md lg:max-w-2xl px-4 py-3 shadow-lg ${bubbleClasses}`}>
        {message.isThinking ? (
          <LoadingSpinner />
        ) : (
          <p
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={formattedText()}
          />
        )}
      </div>
    </div>
  );
};

export default Message;