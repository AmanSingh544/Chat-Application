
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { getClientId } from '../utils/clientId';
import MessageInput from '../components/MesssageInput';
import { ChatWindow } from '../components/ChatWindow';
import '../components/index.css';
import { useParams } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { roomsApi } from '../api/roomsApi';
import { userApi } from '../api/userApi';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { Box, Tooltip, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TopBar from '../components/TopBar';
import ChatHeader from './ChatHeader';


function ChatPage() {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null); // Initialize roomId state
  const { safeApiCall } = useNotification();
  const [typing, setTyping] = useState(false);
  const [currentTypingUser, setCurrentTypingUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const clientId = useRef(getClientId());
  const { roomId } = useParams(); // grabs the roomId from the URL

  const fetchRoomDetails = async () => {
    if (!roomId)
      return;
    const response = await safeApiCall(() => roomsApi.getRoomById(roomId));
    setRoomDetails(response?.data?.data);
    console.log("Room details fetched:", response?.data?.data);
  }

  const getAllUsers = async () => {
    const res = await safeApiCall(() => userApi.getAllUsers());
    setAllUsers(res?.data?.data);
  };

  useEffect(() => {
    fetchRoomDetails();
    getAllUsers();
  }, [roomId]);

  useEffect(() => {
    if (!socket || !roomId)
      return;

    // Join the room
    socket.emit('join room', roomId);

    // Recieve Old message for the room
    socket.on('message history', (history) => {
      console.log('Message history received:', history);
      setMessages(history);
    });

    // Listen for incoming chat messages
    socket.on('chat message', ({ text, senderId }, callback) => {
      console.log('Message received:', text, 'from senderId:', senderId);

      setMessages((prev) => [...prev, { text, senderId }]);
      if (callback) callback(null, { status: 'ok' });
    });

    socket.on('typing', ({ roomId, senderId }) => {
      console.log(`${senderId} is typing...  `);
      setTyping(true);
      setCurrentTypingUser(senderId);
    });

    socket.on('typing stopped', ({ roomId, senderId }) => {
      console.log(`${senderId} stopped typing`);
      setTyping(false);
      setCurrentTypingUser(null);
    });

    return () => {
      socket.off('join room');
      socket.off('typing');
      socket.off('typing stopped');
      socket.off('chat message');
      socket.off('message history');
    };
  }, [socket,roomId]);


  const sendMessage = (text) => {
    if (!text.trim()) return;

    console.log('Sending message:', text, 'from clientId:', clientId.current);

    socket.emit('chat message', { text, senderId: clientId.current, roomId }, (err) => {
      if (err) console.error('Ack error:', err);
    });
    //setMessages((prev) => [...prev, { text, senderId: clientId.current }]);
  };

  const emitTyping = (isTyping) => {
    if (isTyping) {
      console.log('Emitting typing event: ' + clientId.current + "---- " + roomId);
      socket.emit('typing', { roomId, senderId: clientId.current });
    }
    else {
      console.log('Emitting typing stopped event' + clientId.current + "---- " + roomId);
      socket.emit('typing stopped', { roomId, senderId: clientId.current });
    }
  };

  const addMembersToRoom = async (members) => {
    const res = await safeApiCall(() => roomsApi.addMembers(members, roomId));
    if (res?.data?.data) {
      fetchRoomDetails();
    }
  };

  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  const roomMembers = (roomDetails?.members ? roomDetails?.members.length > 0 ? roomDetails?.members : [] : []);
  return (
    <div className="chat-container" style={{ display: 'flex', height: '100vh' }}>

  {/* Right Section: Chat Area */}
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    
    {/* Chat Header */}
    <ChatHeader
      roomDetails={roomDetails}
      allUsers={allUsers}
      onAddMembers={addMembersToRoom}
    />

    {/* Chat Messages */}
    <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 1 }}>
      <ChatWindow messages={messages} clientId={clientId.current} />
    </Box>

    {/* Typing Indicator */}
    {typing && (
      <Box sx={{
        animation: 'colorShift 2s infinite alternate',
        bgcolor: 'lightgreen',
        py: '1px',
        textAlign: 'center'
      }}>
        <Typography variant="subtitle2" color="text.secondary">
          {currentTypingUser} is typing<span className="dot one">.</span><span className="dot two">.</span><span className="dot three">.</span>
        </Typography>
      </Box>
    )}

    {/* Message Input */}
    <Box sx={{ bgcolor: '#f9f9f9', px: 2, py: 1, boxShadow: 2 }}>
      <MessageInput onSend={sendMessage} emitTyping={emitTyping} roomMembers={roomMembers} />
    </Box>
  </div>
</div>


  );
}

export default ChatPage;