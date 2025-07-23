import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

interface TabsAndAddButtonRowProps {
  onAddSubscription: () => void;
}

export function TabsAndAddButtonRow({ onAddSubscription }: TabsAndAddButtonRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
      <Tabs value={0} sx={{ minHeight: 0 }}>
        <Tab label="Subscription List" sx={{ textTransform: 'none', fontWeight: 500, minHeight: 0 }} />
        <Tab label="Subscription Overview" sx={{ textTransform: 'none', fontWeight: 500, minHeight: 0 }} />
        <Tab label="Subscription Calendar" sx={{ textTransform: 'none', fontWeight: 500, minHeight: 0 }} />
      </Tabs>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }} onClick={onAddSubscription}>
        Add Subscription
      </Button>
    </Box>
  );
} 