import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { signOut } from "next-auth/react";

interface HeaderProps {
  userName: string;
  profileMenuAnchor: HTMLElement | null;
  onProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onProfileMenuClose: () => void;
}

export function Header({ 
  userName, 
  profileMenuAnchor, 
  onProfileMenuOpen, 
  onProfileMenuClose 
}: HeaderProps) {
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: "success" | "error" }>({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/' // Redirect to home page after logout
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Show error message to user
      setSnackbar({ 
        open: true, 
        message: "Failed to logout. Please try again.", 
        severity: "error" 
      });
    }
    onProfileMenuClose();
  };

  const handleSnackbarClose = () => setSnackbar(s => ({ ...s, open: false }));
  return (
    <>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 2.5,
        borderBottom: '1px solid #ececec',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#fff',
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#e9f3ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
            <AttachMoneyIcon sx={{ color: '#2196f3', fontSize: 22 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="#18181B">Trackify</Typography>
        </Box>
        {/* Icons and Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton><NotificationsNoneIcon /></IconButton>
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: '#e9f3ff', 
              color: '#2196f3', 
              fontWeight: 700, 
              fontSize: 18,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#d1e7ff',
              }
            }}
            onClick={onProfileMenuOpen}
          >
            {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </Avatar>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={onProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: 2,
          }
        }}
      >
        <MenuItem onClick={onProfileMenuClose}>
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={onProfileMenuClose}>
          <ListItemIcon>
            <HelpOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar for error messages */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
} 