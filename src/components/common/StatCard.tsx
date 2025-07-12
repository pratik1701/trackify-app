import React from "react";
import { Card } from "./Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CardProps as MuiCardProps } from "@mui/material/Card";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface StatCardSublabel {
  percent?: string;
  color: string;
  text: string;
  up?: boolean;
}

interface StatCardProps extends MuiCardProps {
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  value: string | number;
  sublabel?: StatCardSublabel;
  color?: string;
}

export const StatCard = ({ icon, iconBg = "#e9f3ff", label, value, sublabel, color, ...props }: StatCardProps) => (
  <Card
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 3,
      boxShadow: "0 0 0 1px #ececec, 0 2px 8px 0 rgba(16,30,54,0.04)",
      ...props.sx,
    }}
    {...props}
  >
    <Box>
      <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: "#18181B" }}>{value}</Typography>
      {sublabel && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          {sublabel.percent && (
            <>
              {sublabel.up ? (
                <ArrowUpwardIcon fontSize="small" sx={{ color: sublabel.color, mr: 0.5 }} />
              ) : (
                <ArrowDownwardIcon fontSize="small" sx={{ color: sublabel.color, mr: 0.5 }} />
              )}
              <Typography variant="subtitle2" sx={{ color: sublabel.color, fontWeight: 600, mr: 0.5 }}>
                {sublabel.percent}
              </Typography>
            </>
          )}
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {sublabel.text}
          </Typography>
        </Box>
      )}
    </Box>
    <Box
      sx={{
        bgcolor: iconBg,
        borderRadius: 2,
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ml: 2,
      }}
    >
      {icon}
    </Box>
  </Card>
); 