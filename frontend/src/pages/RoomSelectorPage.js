import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Paper
} from '@mui/material';
import { roomsApi } from '../api/roomsApi';
import { useNotification } from '../context/NotificationContext';
import Rooms from './Rooms';

export const RoomSelectorPage = () => {
  const [roomName, setRoomName] = useState('');
  const [purpose, setPurpose] = useState('chat');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [newlyCreatedRoom, setNewlyCreatedRoom] = useState(null);

  const { safeApiCall } = useNotification();

  const roomPurposes = [
    'Fun', 'Entertainment', 'Private', 'Education', 'Gossip', 'Chat',
    'Work', 'Study', 'Socializing'
  ];

  const createRoom = async () => {
    if (!roomName.trim() || !purpose) {
      setError("Please fill in all fields.");
      return;
    }
    const newRoom = { name: roomName.trim(), purpose, isPrivate };

    const { success, data, message } = await safeApiCall(() =>
      roomsApi.createRoom(newRoom.name, newRoom.purpose, newRoom.isPrivate)
    );
    if (!success) {
      console.error("Error creating room:", message);
      setError(message);
      return;
    }

    setNewlyCreatedRoom(data.data);
    setError("");
    setRoomName("");
    setPurpose("chat");
    setIsPrivate(false);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      {/* <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Create a New Room
        </Typography>

        <TextField
          fullWidth
          size="small"
          variant="outlined"
          label="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          margin="dense"
        />

        <FormControl fullWidth margin="dense" size="small">
          <InputLabel id="purpose-label">Purpose</InputLabel>
          <Select
            labelId="purpose-label"
            value={purpose}
            label="Purpose"
            onChange={(e) => setPurpose(e.target.value)}
          >
            {roomPurposes.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              size="small"
            />
          }
          label="Private Room"
          sx={{ mt: 1 }}
        />

        <Box mt={2}>
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={createRoom}
          >
            Create Room
          </Button>
        </Box>

        {error && (
          <Typography color="error" mt={2} fontSize="0.875rem">
            {error}
          </Typography>
        )}
      </Paper> */}

      <Rooms newlyCreatedRoom={newlyCreatedRoom} />
    </Box>
  );
};
