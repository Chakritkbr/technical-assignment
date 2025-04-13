import React, { useEffect, useRef } from 'react';
import Message from './Message';

const ChatArea = ({ messages, user, selectedChatId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChatId]);

  return (
    <div className='flex flex-col w-full h-full overflow-y-auto p-4 bg-blue-50 no-scrollbar'>
      {selectedChatId && messages.length > 0 ? (
        <>
          {messages.map((msg) => (
            <Message
              key={msg._id || msg.messageId}
              msg={msg}
              isMe={msg.sender?._id === user?._id}
              user={user}
            />
          ))}
          <div ref={bottomRef} />
        </>
      ) : (
        <div className='flex items-center justify-center h-full w-full text-gray-500'>
          {selectedChatId ? 'Please text me :)' : 'Choose User or Chat room'}
        </div>
      )}
    </div>
  );
};

export default ChatArea;
