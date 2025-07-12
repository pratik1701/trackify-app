import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  SelectProps as MuiSelectProps,
  FormHelperText,
} from '@mui/material';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  label?: string;
  options: SelectOption[];
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

export function Select({
  label,
  options,
  variant = 'outlined',
  error,
  helperText,
  placeholder,
  sx,
  ...props
}: SelectProps) {
  return (
    <FormControl
      variant={variant}
      error={error}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        {...props}
        label={label}
        displayEmpty={!!placeholder}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
} 