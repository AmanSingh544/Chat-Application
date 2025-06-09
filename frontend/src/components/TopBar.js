import React from 'react';
import { AppBar, Toolbar, Typography, AvatarGroup, Avatar, IconButton, Box, Chip, Tooltip } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

const TopBar = ({ roomDetails, allUsers, onAddMembers }) => {
  return (
    <AppBar position="fixed" sx={{ background: '#ffffff', color: '#000', boxShadow: 2, height: '64px', justifyContent: 'center' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        {/* Left Section: Back + Room Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton edge="start" color="inherit">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" fontWeight="600">{roomDetails?.name}</Typography>
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
        </Box>

        {/* Right Section: Members + Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Add Members">
            <IconButton onClick={onAddMembers}>
              <GroupAddIcon />
            </IconButton>
          </Tooltip>
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
            {allUsers?.map((user, idx) => (
              <Tooltip title={user.name} key={idx}>
                <Avatar src={user.avatar}>{user.name}</Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
