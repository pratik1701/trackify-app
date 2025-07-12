import React from "react";
import Chip from "@mui/material/Chip";

const statusColorMap: Record<string, { color: "primary" | "error" | "warning" | "default"; sx?: any }> = {
  active: { color: "primary", sx: { bgcolor: '#e3f0ff', color: '#2196f3' } },
  overdue: { color: "error", sx: { bgcolor: '#ffeaea', color: '#ef4444' } },
  dueSoon: { color: "warning", sx: { bgcolor: '#fff7e6', color: '#f59e42' } },
};

interface StatusChipProps {
  label: string;
  status: "active" | "overdue" | "dueSoon";
}

export const StatusChip = ({ label, status }: StatusChipProps) => (
  <Chip
    label={label}
    color={statusColorMap[status]?.color || "default"}
    size="small"
    sx={{
      fontWeight: 600,
      fontSize: 13,
      px: 1.5,
      height: 26,
      borderRadius: 1.5,
      ...statusColorMap[status]?.sx,
    }}
  />
); 