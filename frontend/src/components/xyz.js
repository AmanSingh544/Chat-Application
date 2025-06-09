import {
    Box,
    Typography,
    Tooltip,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    Stack,
  } from '@mui/material';
  import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
  import { deepOrange } from '@mui/material/colors';
  import { useState } from 'react';
  
  
  function TopBar({ roomDetails, onAddMembers, allUsers }) {
    const [open, setOpen] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
  
    let filteredUser = [];
    filteredUser = (allUsers && roomDetails) ? 
                    allUsers?.filter(user => roomDetails?.members?.every(member => user._id !== member._id))
                    : [];

    const toggleDialog = () => setOpen(!open);
  
    const handleChipToggle = (member) => {
      setSelectedMembers(prev =>
        prev.includes(member)
          ? prev.filter(m => m !== member)
          : [...prev, member]
      );
    };
  
    const handleAdd = () => {
      onAddMembers(selectedMembers);
      toggleDialog();
      setSelectedMembers([]);
    };
  
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          width: '100%',
          height: '10vh',
          bgcolor: 'lightgreen',
          px: 3,
          zIndex: 1000,
          boxShadow: 3,
        }}
      >
        {/* Chat Name */}
        <Typography variant="h5" fontWeight="bold" color="darkgreen">
          {roomDetails?.name}
        </Typography>
  
        {/* Add Button */}
        <Tooltip title="Add members">
          <IconButton onClick={toggleDialog}>
            <AddCircleOutlineIcon sx={{ color: '#555', fontSize: 32 }} />
          </IconButton>
        </Tooltip>
  
        {/* Member Avatars */}
        <Box sx={{ display: 'flex', gap: 1 , marginRight:'2rem'}}>
          {roomDetails?.members?.map((member) => (
            <Tooltip key={member._id} title={member.username}>
              <Avatar sx={{ bgcolor: deepOrange[500], width: 36, height: 36 }}>
                {member.username[0].toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
        </Box>
  
        {/* Member Selection Dialog */}
        <Dialog open={open} onClose={toggleDialog} fullWidth maxWidth="sm">
          <DialogTitle>Select members to add</DialogTitle>
          <DialogContent>
            <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
              { filteredUser &&  filteredUser.length > 0 ? filteredUser.map((user,index) => (
                <Chip
                  key={user+index}
                  label={user.username}
                  color={selectedMembers.includes(user._id) ? 'primary' : 'default'}
                  onClick={() => handleChipToggle(user._id)}
                  sx={{ m: 0.5 }}
                />
              ))
              : 
              <Typography>
                No User available
              </Typography>
            }
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleDialog}>Cancel</Button>
            <Button onClick={handleAdd} disabled={filteredUser?.length < 1} variant="contained" color="success">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
export default TopBar;  