import React from 'react';
import { Message } from '../components/types/chatTypes';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div 
      className={`message-appear flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`
          max-w-[80%] p-3 rounded-3xl shadow-sm
          ${isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white border border-gray-200 rounded-bl-none'}
        `}
      >
        <p dir="auto" className={`${isUser ? 'text-right' : 'text-left'}`}>
          {message.text}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;