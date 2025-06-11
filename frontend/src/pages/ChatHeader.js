import { Box, Typography, Chip, IconButton, AvatarGroup, Avatar, Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useContext, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { deepOrange } from '@mui/material/colors';
import AvatarLogo from '../components/Avatars';
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";


const ChatHeader = ({ roomDetails, allUsers, onAddMembers }) => {
  
  const themeContext = useContext(ThemeContext);
  const themeColor = themeContext.theme === "light" ? themeContext.themeColors.light : themeContext.themeColors.dark;

  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const toggleDialog = () => setOpen(!open);

  const handleChipToggle = (member) => {
    setSelectedMembers(prev =>
      prev.includes(member)
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  const membersToAdd = allUsers && roomDetails && allUsers.filter(user =>
    roomDetails?.members?.every(rm => rm.username !== user.username)
  );

  const handleAdd = () => {
    onAddMembers(selectedMembers);
    toggleDialog();
    setSelectedMembers([]);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 2,
      borderBottom: '1px solid #e0e0e0',
      bgcolor: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Box sx={{background: themeColor.background, color: themeColor.color}}>
        <Typography variant="h6" fontWeight="bold">
          {roomDetails?.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {roomDetails?.purpose}
          </Typography>
          {roomDetails?.isPrivate ? (
            <Chip icon={<LockIcon fontSize="small" />} label="Private" size="small" />
          ) : (
            <Chip icon={<PublicIcon fontSize="small" />} label="Public" size="small" />
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Add Members">
          <IconButton onClick={toggleDialog}>
            <GroupAddIcon />
          </IconButton>
        </Tooltip>
        <AvatarGroup max={14}>
          {roomDetails && roomDetails?.members.map((user, index) => (
            <AvatarLogo tooltipTitle={user.username} avatarText={user.username[0].toUpperCase()} index={index} clickFn={() => { }} />
          ))}
        </AvatarGroup>
      </Box>

      {/* Member Selection Dialog */}
      <Dialog open={open} onClose={toggleDialog} fullWidth maxWidth="sm">
        <DialogTitle>Select members to add</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
            {membersToAdd && membersToAdd.length > 0 ? membersToAdd.map((member) => (
              <Chip
                key={member._id}
                label={member.username}
                color={selectedMembers.includes(member._id) ? 'primary' : 'default'}
                onClick={() => handleChipToggle(member._id)}
                sx={{ m: 0.5 }}
              />
            ))
              :
              <h3>All Users are already in this room!</h3>
            }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="success">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatHeader;
