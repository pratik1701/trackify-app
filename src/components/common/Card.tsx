import React from "react";
import MuiCard, { CardProps as MuiCardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const Card = ({ children, ...props }: MuiCardProps) => (
  <MuiCard elevation={2} {...props}>
    <CardContent>{children}</CardContent>
  </MuiCard>
); 