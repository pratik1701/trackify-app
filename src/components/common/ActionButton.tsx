import React from "react";
import IconButton from "@mui/material/IconButton";

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}

export const ActionButton = ({ icon, onClick, ariaLabel }: ActionButtonProps) => (
  <IconButton onClick={onClick} aria-label={ariaLabel} size="small">
    {icon}
  </IconButton>
); 