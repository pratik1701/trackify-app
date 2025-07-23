import React from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface TableControlsRowProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  typeFilter?: string;
  onTypeFilterChange?: (value: string) => void;
  cycleFilter?: string;
  onCycleFilterChange?: (value: string) => void;
}

export function TableControlsRow({
  searchValue = "",
  onSearchChange,
  typeFilter = "",
  onTypeFilterChange,
  cycleFilter = "",
  onCycleFilterChange
}: TableControlsRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, mb: 1, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
      {/* Search Bar */}
      <Paper
        component="form"
        sx={{ display: 'flex', alignItems: 'center', width: 260, boxShadow: 'none', border: '1px solid #ececec', borderRadius: 2, px: 1 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: 15 }}
          placeholder="Search subscriptions..."
          inputProps={{ 'aria-label': 'search subscriptions' }}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: '6px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      {/* Type and Cycle Dropdowns */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Select
          value={typeFilter}
          displayEmpty
          size="small"
          sx={{ minWidth: 100, borderRadius: 2, background: '#fff', fontWeight: 500 }}
          onChange={(e) => onTypeFilterChange?.(e.target.value)}
        >
          <MenuItem value="">Type</MenuItem>
          <MenuItem value="recurring">Recurring</MenuItem>
          <MenuItem value="oneTime">One Time</MenuItem>
        </Select>
        <Select
          value={cycleFilter}
          displayEmpty
          size="small"
          sx={{ minWidth: 100, borderRadius: 2, background: '#fff', fontWeight: 500 }}
          onChange={(e) => onCycleFilterChange?.(e.target.value)}
        >
          <MenuItem value="">Cycle</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </Box>
    </Box>
  );
} 