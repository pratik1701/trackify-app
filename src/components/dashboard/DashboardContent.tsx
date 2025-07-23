"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useCreateSubscription, useUpdateSubscription, useDeleteSubscription, useCategories, type Subscription, type CreateSubscriptionData } from "@/hooks/useSubscriptions";
import { signOut } from "next-auth/react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Header } from "./components/Header";
import { StatCardContainer } from "./components/StatCardContainer";
import { TabsAndAddButtonRow } from "./components/TabsAndAddButtonRow";
import { TableControlsRow } from "./components/TableControlsRow";
import { SubscriptionTable } from "./components/SubscriptionTable";





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
  // React Query mutations
  const createSubscriptionMutation = useCreateSubscription();
  const updateSubscriptionMutation = useUpdateSubscription();
  const deleteSubscriptionMutation = useDeleteSubscription();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Modal/dialog/snackbar state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<Subscription | null>(null);
  const [deleteRow, setDeleteRow] = React.useState<Subscription | null>(null);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const [form, setForm] = React.useState<CreateSubscriptionData>({
    name: "",
    amount: 0,
    category: "",
    billingCycle: "monthly",
    frequency: "recurring",
    nextDueDate: "",
    notes: ""
  });
  
  // Profile menu state
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<null | HTMLElement>(null);

  // Handlers for modal, delete, and snackbar
  const handleAdd = () => {
    setEditRow(null);
    setForm({
      name: "",
      amount: 0,
      category: "",
      billingCycle: "monthly",
      frequency: "recurring",
      nextDueDate: "",
      notes: ""
    });
    setModalOpen(true);
  };

  const handleEdit = (row: Subscription) => {
    setEditRow(row);
    setForm({
      name: row.name,
      amount: row.amount,
      category: row.category,
      billingCycle: row.billingCycle,
      frequency: row.frequency,
      nextDueDate: new Date(row.nextDueDate).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
      notes: row.notes || ""
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditRow(null);
  };

  const handleModalSave = async () => {
    try {
      if (editRow) {
        await updateSubscriptionMutation.mutateAsync({
          ...form,
          id: editRow.id
        });
        setSnackbar({ open: true, message: "Subscription updated!", severity: "success" });
      } else {
        await createSubscriptionMutation.mutateAsync(form);
        setSnackbar({ open: true, message: "Subscription added!", severity: "success" });
      }
      setModalOpen(false);
      setEditRow(null);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : "An error occurred", 
        severity: "error" 
      });
    }
  };

  const handleDelete = (row: Subscription) => setDeleteRow(row);

  const handleDeleteConfirm = async () => {
    if (!deleteRow) return;
    
    try {
      await deleteSubscriptionMutation.mutateAsync(deleteRow.id);
      setSnackbar({ open: true, message: "Subscription deleted!", severity: "success" });
      setDeleteRow(null);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : "An error occurred", 
        severity: "error" 
      });
    }
  };

  const handleDeleteCancel = () => setDeleteRow(null);
  const handleSnackbarClose = () => setSnackbar(s => ({ ...s, open: false }));

  // Profile menu handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/' // Redirect to home page after logout
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Show error message to user
      setSnackbar({ 
        open: true, 
        message: "Failed to logout. Please try again.", 
        severity: "error" 
      });
    }
    handleProfileMenuClose();
  };



  return (
    <Box sx={{ background: '#fff', minHeight: '100vh' }}>
      <Header 
        userName={userName}
        profileMenuAnchor={profileMenuAnchor}
        onProfileMenuOpen={handleProfileMenuOpen}
        onProfileMenuClose={handleProfileMenuClose}
        onLogout={handleLogout}
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

      {/* Add/Edit Subscription Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editRow ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField 
            label="Name" 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            fullWidth 
          />
          <TextField 
            label="Amount" 
            type="number"
            value={form.amount} 
            onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} 
            fullWidth 
          />
          <Select
            value={form.billingCycle}
            onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value as any }))}
            fullWidth
            label="Billing Cycle"
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
            <MenuItem value="twoYear">2 Year</MenuItem>
            <MenuItem value="threeYear">3 Year</MenuItem>
          </Select>
          <Select
            value={form.frequency}
            onChange={e => setForm(f => ({ ...f, frequency: e.target.value as any }))}
            fullWidth
            label="Frequency"
          >
            <MenuItem value="recurring">Recurring</MenuItem>
            <MenuItem value="oneTime">One Time</MenuItem>
          </Select>
          <TextField 
            label="Next Due Date" 
            type="date"
            value={form.nextDueDate} 
            onChange={e => setForm(f => ({ ...f, nextDueDate: e.target.value }))} 
            fullWidth 
            InputLabelProps={{ shrink: true }}
          />
          <Autocomplete
            options={categories}
            value={form.category}
            onChange={(event, newValue) => {
              setForm(f => ({ ...f, category: newValue || "" }));
            }}
            onInputChange={(event, newInputValue) => {
              setForm(f => ({ ...f, category: newInputValue }));
            }}
            freeSolo
            loading={categoriesLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                placeholder="Select or type a category"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {categoriesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            fullWidth
          />
          <TextField 
            label="Notes" 
            value={form.notes || ""} 
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} 
            fullWidth 
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button 
            onClick={handleModalSave} 
            variant="contained"
            disabled={createSubscriptionMutation.isPending || updateSubscriptionMutation.isPending}
          >
            {createSubscriptionMutation.isPending || updateSubscriptionMutation.isPending ? "Saving..." : (editRow ? "Save" : "Add")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteRow} onClose={handleDeleteCancel} maxWidth="xs">
        <DialogTitle>Delete Subscription</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <b>{deleteRow?.name}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteSubscriptionMutation.isPending}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteSubscriptionMutation.isPending}
          >
            {deleteSubscriptionMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar/Toast */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

    </Box>
  );
} 