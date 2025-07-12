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
      height: 130,
      padding: 16,
      border: "1px solid #EBEBEA",
      boxShadow: "0px 0px 1px #171a1f12, 0px 0px 2px #171a1f1F",
      background: "#FFFFFFFF", 
      ...props.sx,
    }}
    {...props}
  >
    <Box>
      <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
        {label}
      </Typography>
      <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#18181B" }}>{value}</Typography>
        <Box
          sx={{
            bgcolor: iconBg,
            borderRadius: 2,
            width: 35,
            height: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ml: 2,
          }}
        >
          {icon}
        </Box>
      </Box>
      {sublabel && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
  </Card>
); 