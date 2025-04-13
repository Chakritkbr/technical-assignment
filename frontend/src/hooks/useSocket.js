import { useEffect, useState, useRef } from 'react';

const RECONNECT_DELAY = 1000;
const MAX_RECONNECT_ATTEMPTS = 5;
const CONNECTION_TIMEOUT = 10000;

const useWebSocket = (user, loading, onMessage) => {
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const connectionTimeoutRef = useRef(null);

  const connect = () => {
    if (!user || loading) return;

    clearTimeout(reconnectTimerRef.current);
    clearTimeout(connectionTimeoutRef.current);
    if (ws) {
      ws.close();
    }

    const token = localStorage.getItem('authToken');
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';
    const wsInstance = new WebSocket(`${wsUrl}?token=${token}`);

    setConnectionStatus('connecting');
    console.log('Attempting WebSocket connection...');

    connectionTimeoutRef.current = setTimeout(() => {
      if (wsInstance.readyState === WebSocket.CONNECTING) {
        console.log('Connection timeout');
        wsInstance.close();
        setConnectionStatus('timeout');
        reconnect();
      }
    }, CONNECTION_TIMEOUT);

    wsInstance.onopen = () => {
      clearTimeout(connectionTimeoutRef.current);
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
      setWs(wsInstance);
      console.log('WebSocket connected');
    };

    wsInstance.onclose = (event) => {
      setConnectionStatus('disconnected');
      console.log(
        `WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`
      );
      reconnect();
    };

    wsInstance.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
      wsInstance.close();
    };

    wsInstance.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        console.log('Received message:', messageData);
        if (onMessage) {
          onMessage(messageData);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  };

  const reconnect = () => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current);
    console.log(
      `Reconnecting in ${delay}ms... (Attempt ${
        reconnectAttemptsRef.current + 1
      })`
    );

    reconnectTimerRef.current = setTimeout(() => {
      reconnectAttemptsRef.current += 1;
      connect();
    }, delay);
  };

  const disconnect = () => {
    clearTimeout(reconnectTimerRef.current);
    clearTimeout(connectionTimeoutRef.current);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    setWs(null);
    setConnectionStatus('disconnected');
  };

  useEffect(() => {
    console.log('useWebSocket useEffect triggered:', {
      user,
      loading,
      onMessage,
    });
    connect();

    const handleOnline = () => {
      console.log('Network online - reconnecting');
      reconnectAttemptsRef.current = 0;
      connect();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      disconnect();
      window.removeEventListener('online', handleOnline);
    };
  }, [user, loading, onMessage]);

  return { ws, connectionStatus, disconnect };
};

export default useWebSocket;
