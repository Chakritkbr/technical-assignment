import React from 'react';

const ChatInput = ({ value, onChange, onSendMessage, connectionStatus }) => {
  return (
    <div className='flex items-center w-full'>
      <input
        type='text'
        className='flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder='type you text...'
        value={value}
        onChange={onChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && connectionStatus === 'connected') {
            onSendMessage();
          }
        }}
      />
      <button
        className='ml-2 p-2 lg:px-15 md:px-10 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        onClick={onSendMessage}
        disabled={connectionStatus !== 'connected'}
      >
        Send
      </button>
      {connectionStatus !== 'connected' && (
        <span className='ml-2 text-gray-500'>กำลังเชื่อมต่อ...</span>
      )}
    </div>
  );
};

export default ChatInput;
