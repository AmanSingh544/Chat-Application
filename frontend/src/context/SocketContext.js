import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { CONSTANTS } from '../constants/constant';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const API_BASE_URL = CONSTANTS.API_BASE_URL;
  const token = localStorage.getItem('token'); 
  useEffect(() => {
    const socketInstance = io(API_BASE_URL, {
      transports: ['websocket'],
      auth: {
        token,  // send token here
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
