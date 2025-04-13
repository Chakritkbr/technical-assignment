import React from 'react';
import Avatar from '../Avatar';

const UserListItem = ({ user, isCurrentUser, onClick }) => {
  if (isCurrentUser) return null;

  return (
    <li
      key={user?._id}
      className='flex items-center hover:bg-gray-100 rounded-md p-2 cursor-pointer gap-3'
      onClick={() => onClick(user?._id)}
    >
      <Avatar
        username={user.username}
        userId={user._id}
        online={user.online}
        className='h-10 w-10 rounded-full mr-2'
      />
      <span className='text-gray-800'>{user?.username}</span>
    </li>
  );
};

export default UserListItem;
