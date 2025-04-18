import React from 'react';
import Avatar from './Avatar';

const Contact = ({
  id,
  onClick,
  selected,
  username,
  online,
  isRoom,
  name,
  showOnlyAvatar,
}) => {
  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={
        'border-b border-gray-100  flex items-center gap-2 cursor-pointer ' +
        (selected ? 'bg-blue-50' : '')
      }
    >
      {selected && <div className='w-1 bg-blue-500 h-12 rounded-r-md'></div>}
      <div className='flex gap-2 py-2 pl-4 items-center'>
        {showOnlyAvatar ? (
          <Avatar online={online} username={username || name} userId={id} />
        ) : (
          <>
            {isRoom ? (
              <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white'>
                {name ? name.charAt(0).toUpperCase() : '#'}{' '}
                {/* แสดงตัวอักษรแรกของชื่อห้อง */}
              </div>
            ) : (
              <Avatar online={online} username={username} userId={id} />
            )}
            <span className='text-gray-800'>{isRoom ? name : username}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Contact;
