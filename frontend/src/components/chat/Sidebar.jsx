import React, { useState, useMemo } from 'react';
import { createRooms, joinRoom } from '../../api/chatAPI';
import Logo from '../Logo';
import Avatar from '../Avatar';
import UserListItem from './UserListItem';
import RoomListItem from './RoomListItem';
import ConnectionStatus from './ConnectionStatus';
import CreateRoomModal from '../modal/CreatRoomModal';

const Sidebar = ({
  users,
  rooms,
  onUserClick,
  onRoomClick,
  user,
  logout,
  connectionStatus,
  onRoomCreated,
  socket,
}) => {
  // เพิ่ม socket prop
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const sortUsersByOnlineStatus = (users) => {
    return [...users].sort((a, b) => {
      if (a.online && !b.online) return -1;
      if (!a.online && b.online) return 1;
      return 0;
    });
  };

  const sortedUsersForChat = useMemo(() => {
    return sortUsersByOnlineStatus(users);
  }, [users]);

  const handleOpenCreateRoomModal = () => {
    setIsCreateRoomModalOpen(true);
  };

  const handleCloseCreateRoomModal = () => {
    setIsCreateRoomModalOpen(false);
  };

  const handleCreateRoom = async (roomName, roomDescription, selectedUsers) => {
    try {
      const payload = {
        name: roomName,
        description: roomDescription,
        userIds: selectedUsers,
      };
      const newRoom = await createRooms(payload);
      console.log('Room created successfully:', newRoom);
      if (onRoomCreated) {
        onRoomCreated(newRoom);
      }
      if (socket) {
        socket.emit('joinRoom', { roomId: newRoom.data.id });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert(`Failed to create room: ${error.message || 'Unknown error'}`);
    } finally {
      handleCloseCreateRoomModal();
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const response = await joinRoom(roomId);
      console.log('เข้าร่วมห้องสำเร็จ:', response);
      // อัปเดต UI เพื่อแสดงว่าผู้ใช้เข้าร่วมห้องแล้ว
      if (socket) {
        socket.emit('joinRoom', { roomId });
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเข้าร่วมห้อง:', error);
      alert(
        `ไม่สามารถเข้าร่วมห้องได้: ${
          error.message || 'เกิดข้อผิดพลาดที่ไม่รู้จัก'
        }`
      );
    }
  };
  return (
    <div className='bg-gray-50 w-0.7/3 flex flex-col border-r border-gray-300 shadow-md flex-shrink-0'>
      <div className='p-4  flex items-center justify-center'>
        <Logo className='h-8 w-auto' />
      </div>
      <ConnectionStatus connectionStatus={connectionStatus} />
      <div className='p-4 border-b border-gray-300 flex-grow overflow-y-auto no-scrollbar shadow-md'>
        <h2 className='text-md font-semibold text-gray-700 mb-2'>Users</h2>
        <ul className='space-y-2'>
          {sortedUsersForChat.map((u) => (
            <UserListItem
              key={u?._id}
              user={u}
              isCurrentUser={u?._id === user?._id}
              onClick={onUserClick}
            />
          ))}
        </ul>
      </div>
      <div className='p-4 border-b border-gray-300 flex-grow overflow-y-auto no-scrollbar shadow-md'>
        <h2 className='text-md font-semibold text-gray-700 mb-2 flex items-center justify-between'>
          Rooms
          <button
            onClick={handleOpenCreateRoomModal}
            className='text-sm bg-green-100 py-1 px-2 text-green-600 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500'
          >
            Create
          </button>
        </h2>
        <div className='mb-4 '>
          <h3 className='text-sm font-semibold text-gray-600 mb-1'>Joined</h3>
          <ul className='space-y-2 '>
            {rooms.joined.map((room) => (
              <RoomListItem key={room?._id} room={room} onClick={onRoomClick} />
            ))}
            {rooms.joined.length === 0 && (
              <li className='text-sm text-gray-500'>No Joinable Room</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className='text-sm font-semibold text-gray-600 mb-1'>
            Available
          </h3>
          <ul className='space-y-2'>
            {rooms.available.map((room) => (
              <li key={room?._id} className='flex items-center justify-between'>
                <RoomListItem room={room} onClick={onRoomClick} />
                <button
                  onClick={() => handleJoinRoom(room._id)}
                  className='text-sm bg-blue-100 py-1 px-2 text-blue-600 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  Join
                </button>
              </li>
            ))}
            {rooms.available.length === 0 && (
              <li className='text-sm text-gray-500'>No joable room</li>
            )}
          </ul>
        </div>
      </div>
      <div className='flex items-center justify-between p-4 border-t border-gray-200 bg-white shadow-sm'>
        <div className='flex items-center space-x-3'>
          <Avatar
            username={user.username}
            userId={user._id}
            online={true}
            className='h-10 w-10 rounded-full shadow'
          />
          <span className='text-base font-medium text-gray-800'>
            {user.username}
          </span>
        </div>

        <button
          onClick={logout}
          className='bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all shadow-sm'
        >
          Logout
        </button>
      </div>

      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={handleCloseCreateRoomModal}
        users={users}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default Sidebar;
