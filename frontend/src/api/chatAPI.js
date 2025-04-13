import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`; // ปรับ URL ฐานให้ชี้ไปที่ /api

export const getRooms = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_BASE_URL}/room`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch rooms' };
  }
};

export const createRooms = async (payload) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await axios.post(`${API_BASE_URL}/room`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create rooms' };
  }
};

export const getPrivateMessages = async (userId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(
      `${API_BASE_URL}/message/private/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: 'Failed to fetch private messages' }
    );
  }
};

export const getRoomMessages = async (roomId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(
      `${API_BASE_URL}/message/rooms/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch room messages' };
  }
};

export const getAvailableRooms = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_BASE_URL}/room/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: 'Failed to fetch available rooms' }
    );
  }
};

export const joinRoom = async (roomId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_BASE_URL}/room/${roomId}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to join rooms' };
  }
};
