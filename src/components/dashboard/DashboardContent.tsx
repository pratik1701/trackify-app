"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { type Subscription } from "@/hooks/useSubscriptions";
import { Header } from "./components/Header";
import { StatCardContainer } from "./components/StatCardContainer";
import { TabsAndAddButtonRow } from "./components/TabsAndAddButtonRow";
import { TableControlsRow } from "./components/TableControlsRow";
import { SubscriptionTable } from "./components/SubscriptionTable";
import { SubscriptionModal } from "./components/SubscriptionModal";
import { DeleteSubscriptionModal } from "./components/DeleteSubscriptionModal";

interface DashboardContentProps {
  subscriptions: Subscription[];
  totalMonthlySpend: number;
  totalYearlySpend: number;
  totalOneTimeExpenses: number;
  userName: string;
}

export function DashboardContent({ 
  subscriptions, 
  totalMonthlySpend, 
  totalYearlySpend, 
  totalOneTimeExpenses, 
  userName 
}: DashboardContentProps) {
  // Modal/dialog/snackbar state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<Subscription | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<Subscription | null>(null);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  
  // Profile menu state
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<null | HTMLElement>(null);

  // Handlers for modal, delete, and snackbar
  const handleAdd = () => {
    setEditRow(null);
    setModalOpen(true);
  };

  const handleEdit = (row: Subscription) => {
    setEditRow(row);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditRow(null);
  };

  const handleModalSuccess = (message: string) => {
    setSnackbar({ open: true, message, severity: "success" });
  };

  const handleModalError = (message: string) => {
    setSnackbar({ open: true, message, severity: "error" });
  };

  const handleDelete = (row: Subscription) => setDeleteRow(row);

  const handleDeleteClose = () => setDeleteRow(null);
  const handleSnackbarClose = () => setSnackbar(s => ({ ...s, open: false }));

  // Profile menu handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh' }}>
      <Header 
        userName={userName}
        profileMenuAnchor={profileMenuAnchor}
        onProfileMenuOpen={handleProfileMenuOpen}
        onProfileMenuClose={handleProfileMenuClose}
      />
      <StatCardContainer 
        subscriptions={subscriptions}
        totalMonthlySpend={totalMonthlySpend}
      />

      <TabsAndAddButtonRow onAddSubscription={handleAdd} />

      <TableControlsRow />

      <SubscriptionTable 
        subscriptions={subscriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SubscriptionModal
        open={modalOpen}
        editSubscription={editRow}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        onError={handleModalError}
      />

      <DeleteSubscriptionModal
        subscription={deleteRow}
        onClose={handleDeleteClose}
        onSuccess={handleModalSuccess}
        onError={handleModalError}
      />

      {/* Snackbar/Toast */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

    </Box>
  );
} 