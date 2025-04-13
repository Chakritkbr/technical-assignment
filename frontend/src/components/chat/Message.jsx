import React from 'react';

const Message = ({ msg, isMe }) => {
  return (
    <div
      key={msg._id || msg.messageId}
      className={`mb-2 p-2 rounded-md shadow-sm text-gray-800 ${
        isMe ? 'bg-green-100 self-end' : 'bg-white self-start'
      }`}
      style={{ maxWidth: '80%' }}
    >
      <span
        className={`font-semibold ${isMe ? 'text-green-700' : 'text-blue-700'}`}
      >
        {isMe ? 'You' : msg.sender?.username}:
      </span>{' '}
      {msg.content}
      <div
        className={`text-xs text-gray-500 ${isMe ? 'text-right' : 'text-left'}`}
      >
        {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
};

export default Message;
