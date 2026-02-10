'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    
    socketInstance.on('NEW_ORDER', (data) => {
      console.log('📦 New order notification:', data);
      
      const notification = {
        id: Date.now(),
        ...data,
      };

      setNotifications((prev) => [notification, ...prev].slice(0, 10)); // Keep last 10
    });

    setSocket(socketInstance);

    
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    socket,
    notifications,
    isConnected,
    clearNotifications,
  };
};