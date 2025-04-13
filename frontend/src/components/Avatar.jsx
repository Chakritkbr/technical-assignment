import React from 'react';

const Avatar = ({ userId, username, online, size = 'normal' }) => {
  const colors = [
    'bg-red-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-indigo-200',
  ];

  const userIdBase10 = parseInt(userId?.substring(10), 16); // ใช้ optional chaining กับ userId ด้วย
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  const sizeClasses = size === 'small' ? 'w-6 h-6' : 'w-8 h-8';
  const onlineIndicator = size === 'small' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div
      className={`relative rounded-full flex items-center justify-center ${sizeClasses} ${color}`}
    >
      {username && (
        <div className='opacity-70'>{username[0]?.toUpperCase()}</div>
      )}{' '}
      {/* ตรวจสอบ username ก่อน */}
      {online && (
        <div
          className={`absolute bottom-0 right-0 rounded-full border border-white bg-green-500 ${onlineIndicator}`}
        ></div>
      )}
      {!online && online !== undefined && (
        <div
          className={`absolute bottom-0 right-0 rounded-full border border-white bg-gray-400 ${onlineIndicator}`}
        ></div>
      )}
    </div>
  );
};

export default Avatar;
