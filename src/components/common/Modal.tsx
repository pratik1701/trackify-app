import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  showCloseButton?: boolean;
  actions?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  actions,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ whiteSpace: 'pre-line' }}>
          {children}
        </Box>
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
} 