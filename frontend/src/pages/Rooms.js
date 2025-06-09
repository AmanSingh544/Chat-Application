import React, { useState, useEffect } from 'react';
import { Button, Paper, Tooltip } from '@mui/material';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { roomsApi } from '../api/roomsApi';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const Rooms = ({newlyCreatedRoom}) => {
    const [error, setError] = useState("");
    const [availableRooms, setAvailableRooms] = useState([
        { name: 'General', purpose: 'Chat', isPrivate: false },
        { name: 'Dev-talk', purpose: 'Education', isPrivate: false },
        { name: "Study Group", purpose: "Study", isPrivate: false },
        { name: "Work Discussions", purpose: "Work", isPrivate: true }
    ]);
    const navigate = useNavigate();

    const { safeApiCall } = useNotification();

    const user = JSON.parse(localStorage.getItem('user'));
    
    useEffect(() => {
        fetchRooms(); // ✅ call the async function
    }, [newlyCreatedRoom && newlyCreatedRoom]);

    const fetchRooms = async () => {
        const { success, data, message } = await safeApiCall(() => roomsApi.getRooms());
        if (!success) {
            console.error("Failed to fetch rooms:", message);
            setError(error);
            return;
        }

        console.log("Available rooms fetched:", data);
        setAvailableRooms(data?.data); // ✅ set the actual rooms data
        setError("");
    };

    const joinRoom = async (room) => {
        const { success, data, message } = await safeApiCall(() =>
            roomsApi.joinRoom(room._id)
        );
        if (data) {
            console.log("Joined room successfully:", data);
            // Redirect to chat page or perform any other action after joining
            navigate(`/dashboard/chat/${room._id}`, { state: { roomName: room.name } });
        }
        if (!success) {
            console.error("Error joining room:", message);
            setError(message);
            return;
        }
        setError("");
    };

    return (
        <>
            <Box>
                <Typography variant="h6" gutterBottom mt={4}>
                    Available Rooms
                </Typography>
                <List>
                    {availableRooms && availableRooms.map((room, index) => (
                       <ListItem key={index} disableGutters sx={{ p: 0, mb: 3 }}>
                       <Paper
                         elevation={1}
                         sx={{
                           p: 1.2,
                           width: '100%',
                           borderRadius: 2,
                           display: 'flex',
                           flexDirection: 'column',
                           gap: 0.5,
                           backgroundColor: '#f8f8f8',
                         }}
                       >
                         {/* Room Title */}
                         <Typography
                           variant="subtitle2"
                           sx={{
                             fontWeight: 600,
                             fontSize: '14px',
                             whiteSpace: 'nowrap',
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                           }}
                         >
                           {room.name}
                         </Typography>
                     
                         {/* Secondary Info */}
                         <Typography
                           variant="body2"
                           color="text.secondary"
                           sx={{ fontSize: '13px', lineHeight: 1.3 }}
                         >
                           Purpose: {room.purpose} | {room.isPrivate ? 'Private' : 'Public'}
                         </Typography>
                     
                         {/* Button Row */}
                         <Box display="flex" gap={1} mt={0.5}>
                           <Button
                             variant="contained"
                             fullWidth
                             size="small"
                             sx={{ py: 0.3, fontSize: '12px' }}
                             onClick={() => joinRoom(room)}
                           >
                             Join
                           </Button>
                     
                           {room.members?.length > 0 && !room.members.includes(user?._id) ? (
                             <Tooltip title="You are not a member of this room">
                               <span style={{ width: '100%' }}>
                                 <Button
                                   variant="contained"
                                   fullWidth
                                   size="small"
                                   disabled
                                   sx={{ py: 0.3, fontSize: '12px' }}
                                 >
                                   Open Chat
                                 </Button>
                               </span>
                             </Tooltip>
                           ) : (
                             <Button
                               variant="contained"
                               fullWidth
                               size="small"
                               sx={{ py: 0.3, fontSize: '12px' }}
                               onClick={() => navigate(`/dashboard/chat/${room._id}`)}
                             >
                               Open Chat
                             </Button>
                           )}
                         </Box>
                       </Paper>
                     </ListItem>
                     
                      
                    ))}
                </List>
            </Box>
        </>
    );
};

export default Rooms;