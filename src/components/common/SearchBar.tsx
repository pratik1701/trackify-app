import React from "react";
import TextField from "@mui/material/TextField";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => (
  <TextField
    variant="outlined"
    size="small"
    value={value}
    onChange={onChange}
    placeholder={placeholder || "Search..."}
    fullWidth
    InputProps={{ sx: { borderRadius: 2 } }}
  />
); 