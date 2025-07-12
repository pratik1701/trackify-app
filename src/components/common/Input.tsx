import React from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  showPasswordToggle?: boolean;
  error?: boolean;
  helperText?: string;
}

export function Input({
  variant = 'outlined',
  showPasswordToggle = false,
  type = 'text',
  error,
  helperText,
  sx,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getInputType = () => {
    if (type === 'password' && showPasswordToggle) {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const getInputProps = () => {
    if (type === 'password' && showPasswordToggle) {
      return {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePassword}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      };
    }
    return {};
  };

  return (
    <TextField
      {...props}
      variant={variant}
      type={getInputType()}
      InputProps={getInputProps()}
      error={error}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
    />
  );
} 