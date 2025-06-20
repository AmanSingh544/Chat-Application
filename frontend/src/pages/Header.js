import { Box, Typography, Avatar, IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import { Logout, Settings, Brightness4, Circle } from "@mui/icons-material";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const Header = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const themeContext = useContext(ThemeContext);
  const authContext = useContext(AuthContext);

  return (
    <>
    <Box sx={{display:'flex', flexDirection:'row'}}>
    <Box sx={{
      width: '40%',
      height: '60px',
      background: 'white',
      color: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: 2,
      paddingY: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      overflowX: 'hidden', // ✅ Hide any accidental overflow
      boxSizing: 'border-box', // ✅ Prevent width + padding issues
    }}>
      <h3>Logo</h3><span>ToogleSideBar</span>
    </Box>
    <Box
    sx={{
      width: '60%',
      height: '60px',
      background: '#0047FF',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: 2,
      paddingY: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      overflowX: 'hidden', // ✅ Hide any accidental overflow
      boxSizing: 'border-box', // ✅ Prevent width + padding issues
    }}
  >
    {/* Left Side */}
    <Typography variant="h6" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
      💬 Chat Dashboard
    </Typography>
  
    {/* Right Side */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
      <Circle sx={{ fontSize: 12, color: '#4CAF50' }} />
      <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>{user?.name || "User"}</Typography>
      <Tooltip title="User Menu">
        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
          <Avatar alt={user?.name} src={user?.avatar || ""} />
        </IconButton>
      </Tooltip>
  
      {/* Menu stays the same */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Settings fontSize="small" sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <MenuItem onClick={() => {handleMenuClose(); themeContext.toogleTheme()}}>
          <Brightness4 fontSize="small" sx={{ mr: 1 }} /> Toggle Theme
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); authContext.setLogout(); }}>
          <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>
    </Box>
  </Box>
    </Box>
  </>
  );
};

export default Header;
