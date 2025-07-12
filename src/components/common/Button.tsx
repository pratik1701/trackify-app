import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outlined';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  sx,
  ...props
}: ButtonProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            ...sx,
          },
        };
      case 'secondary':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: 'secondary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
            ...sx,
          },
        };
      case 'danger':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: 'error.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'error.dark',
            },
            ...sx,
          },
        };
      case 'success':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: 'success.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'success.dark',
            },
            ...sx,
          },
        };
      case 'outlined':
        return {
          variant: 'outlined' as const,
          sx: {
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
            ...sx,
          },
        };
      default:
        return {
          variant: 'contained' as const,
          sx,
        };
    }
  };

  const variantProps = getVariantProps();

  return (
    <MuiButton
      {...props}
      {...variantProps}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : props.startIcon}
    >
      {children}
    </MuiButton>
  );
} 