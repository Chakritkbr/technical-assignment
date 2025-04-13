import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/UserContext.jsx';
import useWebSocket from '../../hooks/useSocket.js';
import { getUsers } from '../../api/authApi.js';
import {
  getPrivateMessages as fetchPrivateMessages,
  getRoomMessages as fetchRoomMessages,
} from '../../api/chatAPI.js';
import Sidebar from './SideBar.jsx';
import ChatArea from './ChatArea.jsx';
import ChatInput from './ChatInput.jsx';

const Chat = () => {
  const { user: rawUser, logout: authLogout, loading } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [rooms, setRooms] = useState({ joined: [], available: [] });
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useMemo(() => rawUser, [rawUser]);

  const handleWsMessage = useCallback(
    (messageData) => {
      switch (messageData.event) {
        case 'initial_rooms_data':
          setRooms(messageData.data);
          break;
        case 'new_message':
          setMessages((prevMessages) => [...prevMessages, messageData.data]);
          break;
        case 'private_message':
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, messageData.data];
            return updatedMessages;
          });
          break;
        case 'room_message':
          setMessages((prevMessages) => [...prevMessages, messageData.data]);
          break;
        default:
      }
    },
    [setMessages]
  );
  const { ws, connectionStatus, disconnect } = useWebSocket(
    user,
    loading,
    handleWsMessage
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await getUsers();
        setAllUsers(usersData.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    loadUsers();
  }, []);

  const handleLogout = async () => {
    disconnect();
    await authLogout();
  };

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (selectedChatId) {
        try {
          let messagesData;
          const isUser = allUsers.some((u) => u._id === selectedChatId);
          if (isUser) {
            const response = await fetchPrivateMessages(selectedChatId);
            messagesData = response.data;
          } else {
            const response = await fetchRoomMessages(selectedChatId);
            messagesData = response.data;
          }
          setMessages(messagesData);
        } catch (error) {
          console.error('Failed to fetch initial messages:', error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };

    loadInitialMessages();
  }, [selectedChatId, fetchPrivateMessages, fetchRoomMessages, allUsers]);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (
      newMessage.trim() &&
      selectedChatId &&
      connectionStatus === 'connected' &&
      ws?.readyState === WebSocket.OPEN
    ) {
      const isUser = allUsers.some((u) => u._id === selectedChatId);
      let eventType;
      let payloadData;
      let sentMessage;

      if (isUser) {
        eventType = 'private_message';
        payloadData = {
          recipientId: selectedChatId,
          content: newMessage,
        };
        sentMessage = {
          sender: user,
          content: newMessage,
          createdAt: new Date().toISOString(),
          _id: `client-${Date.now()}`,
        };
      } else {
        eventType = 'room_message';
        payloadData = {
          roomId: selectedChatId,
          content: newMessage,
        };
        sentMessage = {
          sender: user,
          content: newMessage,
          createdAt: new Date().toISOString(),
          messageId: `client-${Date.now()}`,
        };
      }

      const messagePayload = {
        event: eventType,
        data: payloadData,
      };
      console.log('Sending payload:', messagePayload);
      ws.send(JSON.stringify(messagePayload));
      setNewMessage('');

      if (!isUser) {
        setMessages((prevMessages) => [...prevMessages, sentMessage]);
      }
    } else {
      console.error('WebSocket is not connected or no message to send.');
    }
  };

  const handleUserClick = (userId) => {
    setSelectedChatId(userId);
    setMessages([]);
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  };

  const handleRoomClick = (roomId) => {
    setSelectedChatId(roomId);
    setMessages([]);
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        Please log in to access the chat
      </div>
    );
  }

  const getSelectedName = () => {
    if (selectedChatId) {
      const isUser = allUsers.some((u) => u._id === selectedChatId);
      if (isUser) {
        const selectedUser = allUsers.find((u) => u._id === selectedChatId);
        return selectedUser ? selectedUser.username : '';
      } else {
        const selectedRoom = rooms.joined.find(
          (room) => room._id === selectedChatId
        );
        return selectedRoom ? selectedRoom.name : '';
      }
    }
    return '';
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      {isMobileView && (
        <button
          onClick={toggleSidebar}
          className='fixed top-4 left-4 bg-blue-500 text-white p-2 rounded z-10'
        >
          {isSidebarOpen ? 'Close' : 'Open'}
        </button>
      )}

      {(isMobileView ? isSidebarOpen : true) && (
        <Sidebar
          users={allUsers}
          rooms={rooms}
          onUserClick={handleUserClick}
          onRoomClick={handleRoomClick}
          user={user}
          logout={handleLogout}
          className={`w-full sm:w-1/4 max-w-xs flex-shrink-0 ${
            isMobileView
              ? 'fixed top-0 left-0 h-full bg-gray-100 z-20 transition-transform duration-300 transform translate-x-0'
              : ''
          } ${isMobileView && !isSidebarOpen ? '-translate-x-full' : ''}`}
          connectionStatus={connectionStatus}
        />
      )}

      <div className='flex flex-col flex-grow overflow-hidden'>
        {selectedChatId && (
          <div className='flex justify-between items-center h-[60px] bg-blue-500 text-white p-4 shadow-lg border-b border-blue-600'>
            <span className='text-lg font-semibold'>{getSelectedName()}</span>
          </div>
        )}

        <ChatArea
          messages={messages}
          user={user}
          selectedChatId={selectedChatId}
          allUsers={allUsers}
          rooms={rooms}
          className='flex-grow overflow-y-auto'
        />
        {selectedChatId && (
          <div className='p-4 border-t border-gr bg-white'>
            <ChatInput
              value={newMessage}
              onChange={handleInputChange}
              onSendMessage={handleSendMessage}
              connectionStatus={connectionStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
