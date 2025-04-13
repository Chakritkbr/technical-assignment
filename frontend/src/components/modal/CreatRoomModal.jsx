import React, { useState } from 'react';

const CreateRoomModal = ({ isOpen, onClose, users, onCreateRoom }) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState(''); // State สำหรับเก็บคำอธิบาย
  const [selectedUsersForRoom, setSelectedUsersForRoom] = useState([]);

  const handleNewRoomNameChange = (event) => {
    setNewRoomName(event.target.value);
  };

  const handleNewRoomDescriptionChange = (event) => {
    // Handler สำหรับการเปลี่ยนแปลงคำอธิบาย
    setNewRoomDescription(event.target.value);
  };

  const handleUserCheckboxChange = (userId) => {
    setSelectedUsersForRoom((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleCreate = () => {
    if (
      newRoomName.trim() &&
      newRoomDescription.trim() &&
      selectedUsersForRoom.length > 0
    ) {
      // เพิ่มการตรวจสอบคำอธิบาย
      onCreateRoom(newRoomName, newRoomDescription, selectedUsersForRoom); // ส่งคำอธิบายไปด้วย
      onClose();
    } else {
      alert('Please fill all the field');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-50'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div className='bg-white p-8 rounded-md shadow-lg w-96'>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>
          Create new Chatroom
        </h2>
        <div className='mb-4'>
          <label
            htmlFor='roomName'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Room name :
          </label>
          <input
            type='text'
            id='roomName'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={newRoomName}
            onChange={handleNewRoomNameChange}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='roomDescription'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Description :
          </label>
          <textarea
            id='roomDescription'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={newRoomDescription}
            onChange={handleNewRoomDescriptionChange}
            rows={3} // เพิ่ม rows attribute เพื่อให้มีขนาดเริ่มต้นที่เหมาะสม
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='users'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Members :
          </label>
          <ul className='space-y-2 border rounded p-2'>
            {users.map((u) => (
              <li key={u?._id} className='flex items-center'>
                <input
                  type='checkbox'
                  value={u?._id}
                  className='mr-2 focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
                  checked={selectedUsersForRoom.includes(u?._id)}
                  onChange={() => handleUserCheckboxChange(u?._id)}
                />
                <label
                  htmlFor={`user-${u?._id}`}
                  className='text-gray-700 text-sm'
                >
                  {u?.username}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
