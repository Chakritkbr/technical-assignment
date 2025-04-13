import React from 'react';
import { FaHashtag } from 'react-icons/fa'; // Import Icon Hashtag สำหรับ Room

const RoomListItem = ({ room, onClick }) => {
  return (
    <div
      className='flex items-center hover:bg-gray-100 rounded-md p-2 cursor-pointer'
      onClick={() => onClick(room?._id)}
    >
      <FaHashtag className='text-gray-500 mr-2' />
      <span className='text-gray-800'>{room?.name}</span>
      {room?.users && (
        <span className='ml-auto text-sm text-gray-500'>
          ({Object.keys(room.users).length})
        </span>
      )}
    </div>
  );
};

export default RoomListItem;
