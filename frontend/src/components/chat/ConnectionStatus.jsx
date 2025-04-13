import React from 'react';

const ConnectionStatus = ({ connectionStatus }) => {
  return (
    <div className='p-2 border-b text-center text-sm bg-gray-100 text-gray-800 border border-gray-300 shadow-md'>
      Status: <span className='font-medium'>{connectionStatus}</span>
      {connectionStatus === 'connecting' && (
        <span className='ml-2 animate-pulse'>...</span>
      )}
      {connectionStatus === 'connected' && (
        <span className='ml-2 text-green-500'>●</span>
      )}
      {connectionStatus === 'error' && (
        <span className='ml-2 text-red-500'>●</span>
      )}
    </div>
  );
};

export default ConnectionStatus;
