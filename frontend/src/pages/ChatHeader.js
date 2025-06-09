import { Box, Typography, Chip, IconButton, AvatarGroup, Avatar, Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const ChatHeader = ({ roomDetails, allUsers, onAddMembers }) => {
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
      <Box>
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
          <IconButton onClick={onAddMembers}>
            <GroupAddIcon />
          </IconButton>
        </Tooltip>
        <AvatarGroup max={4}>
          {allUsers.map((user, index) => (
            <Tooltip title={user.name} key={index}>
              <Avatar>{user.name}</Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      </Box>
    </Box>
  );
};

export default ChatHeader;
