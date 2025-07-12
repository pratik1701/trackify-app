"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { StatCard } from "../common/StatCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "@mui/material/Link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { StatusChip } from "../common/StatusChip";
import { ActionButton } from "../common/ActionButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useCreateSubscription, useUpdateSubscription, useDeleteSubscription, type Subscription, type CreateSubscriptionData } from "@/hooks/useSubscriptions";

const stats = [
  {
    icon: <AttachMoneyIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
    iconBg: '#e9f3ff',
    label: "Total Monthly Spend",
    value: "$396.44",
    sublabel: { percent: "+3.2%", color: "#22c55e", text: "Estimated recurring spend", up: true },
  },
  {
    icon: <CalendarMonthIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
    iconBg: '#e9f3ff',
    label: "Upcoming Bills (7 Days)",
    value: 0,
    sublabel: { text: "Bills due in the next week", color: '#64748b' },
  },
  {
    icon: <SubscriptionsIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
    iconBg: '#e9f3ff',
    label: "Active Subscriptions",
    value: 11,
    sublabel: { percent: "-1.5%", color: "#ef4444", text: "Currently active services", up: false },
  },
  {
    icon: <ReceiptLongIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
    iconBg: '#e9f3ff',
    label: "Avg. Bill Amount",
    value: "$36.04",
    sublabel: { percent: "+0.8%", color: "#22c55e", text: "Average cost per subscription", up: true },
  },
];

// Helper function to get status based on due date
const getSubscriptionStatus = (dueDate: string): 'active' | 'dueSoon' | 'overdue' => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'dueSoon';
  return 'active';
};

// Helper function to format billing cycle for display
const formatBillingCycle = (cycle: string): string => {
  switch (cycle) {
    case 'monthly': return 'Monthly';
    case 'yearly': return 'Yearly';
    case 'twoYear': return '2 Year';
    case 'threeYear': return '3 Year';
    default: return cycle;
  }
};

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

  // Calculate stats from props
  const upcomingBillsCount = subscriptions.filter(sub => {
    const dueDate = new Date(sub.nextDueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const avgBillAmount = subscriptions.length > 0 
    ? subscriptions.reduce((sum, sub) => sum + sub.amount, 0) / subscriptions.length 
    : 0;

  const dynamicStats = [
    {
      icon: <AttachMoneyIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
      iconBg: '#e9f3ff',
      label: "Total Monthly Spend",
      value: `$${totalMonthlySpend.toFixed(2)}`,
      sublabel: { text: "Estimated recurring spend", color: '#64748b' },
    },
    {
      icon: <CalendarMonthIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
      iconBg: '#e9f3ff',
      label: "Upcoming Bills (7 Days)",
      value: upcomingBillsCount,
      sublabel: { text: "Bills due in the next week", color: '#64748b' },
    },
    {
      icon: <SubscriptionsIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
      iconBg: '#e9f3ff',
      label: "Active Subscriptions",
      value: subscriptions.length,
      sublabel: { text: "Currently active services", color: '#64748b' },
    },
    {
      icon: <ReceiptLongIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
      iconBg: '#e9f3ff',
      label: "Avg. Bill Amount",
      value: `$${avgBillAmount.toFixed(2)}`,
      sublabel: { text: "Average cost per subscription", color: '#64748b' },
    },
  ];

  // Header
  return (
    <Box sx={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 2.5,
        borderBottom: '1px solid #ececec',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#fff',
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#e9f3ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
            <AttachMoneyIcon sx={{ color: '#2196f3', fontSize: 22 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="#18181B">Trackify</Typography>
        </Box>
        {/* Search Bar */}
        <Paper
          component="form"
          sx={{ display: 'flex', alignItems: 'center', width: 340, boxShadow: 'none', border: '1px solid #ececec', borderRadius: 2, px: 1 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: 15 }}
            placeholder="Search subscriptions..."
            inputProps={{ 'aria-label': 'search subscriptions' }}
          />
          <IconButton type="submit" sx={{ p: '6px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        {/* Icons and Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton><HelpOutlineIcon /></IconButton>
          <IconButton><SettingsOutlinedIcon /></IconButton>
          <IconButton><NotificationsNoneIcon /></IconButton>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#e9f3ff', color: '#2196f3', fontWeight: 700, fontSize: 18 }}>
            {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </Avatar>
        </Box>
      </Box>

      {/* Dashboard Title */}
      <Box sx={{ px: 4, pt: 4, pb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="#18181B">Dashboard</Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'flex', gap: 3, px: 4, mb: 3, flexWrap: 'wrap', flexDirection: { xs: 'column', md: 'row' } }}>
        {dynamicStats.map((stat, idx) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            iconBg={stat.iconBg}
            label={stat.label}
            value={stat.value}
            sublabel={stat.sublabel}
            sx={{ flex: 1, minWidth: 260 }}
          />
        ))}
      </Box>

      {/* Tabs and Add Button Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
        <Tabs value={0} sx={{ minHeight: 0 }}>
          <Tab label="Subscription List" sx={{ textTransform: 'none', fontWeight: 500, minHeight: 0 }} />
          <Tab label="Subscription Overview" sx={{ textTransform: 'none', fontWeight: 500, minHeight: 0 }} />
          <Tab label="Subscription Calendar" sx={{ textTransform: 'none', fontWeight: 500, minHeight: 0 }} />
        </Tabs>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }} onClick={handleAdd}>
          Add Subscription
        </Button>
      </Box>

      {/* Table Controls Row */}
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
          />
          <IconButton type="submit" sx={{ p: '6px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        {/* Type and Cycle Dropdowns */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Select
            value={""}
            displayEmpty
            size="small"
            sx={{ minWidth: 100, borderRadius: 2, background: '#fff', fontWeight: 500 }}
          >
            <MenuItem value="">Type</MenuItem>
            <MenuItem value="recurring">Recurring</MenuItem>
            <MenuItem value="oneTime">One Time</MenuItem>
          </Select>
          <Select
            value={""}
            displayEmpty
            size="small"
            sx={{ minWidth: 100, borderRadius: 2, background: '#fff', fontWeight: 500 }}
          >
            <MenuItem value="">Cycle</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ px: 4, pb: 2 }}>
        <Paper elevation={1} sx={{ borderRadius: 3 }}>
          {subscriptions.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}>
              <Box sx={{ mb: 2 }}>
                {/* Placeholder illustration (could use an SVG or MUI icon) */}
                <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="80" height="80" rx="16" fill="#f6f7fa" />
                  <path d="M24 40h32M24 48h32M24 32h32" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>No subscriptions found</Typography>
              <Typography variant="body2">Get started by adding your first subscription.</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Cycle</TableCell>
                      <TableCell>Next Due Date</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((row) => {
                      const status = getSubscriptionStatus(row.nextDueDate);
                      return (
                        <TableRow key={row.id} sx={{ transition: 'background 0.2s', '&:hover': { background: '#f6f7fa' } }}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>${row.amount.toFixed(2)}</TableCell>
                          <TableCell>{formatBillingCycle(row.billingCycle)}</TableCell>
                          <TableCell>{new Date(row.nextDueDate).toLocaleDateString()}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell><StatusChip label={status === "dueSoon" ? "Due Soon" : status.charAt(0).toUpperCase() + status.slice(1)} status={status} /></TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit" arrow>
                              <span>
                                <ActionButton icon={<EditIcon fontSize="small" />} onClick={() => handleEdit(row)} ariaLabel="Edit" />
                              </span>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <span>
                                <ActionButton icon={<DeleteIcon fontSize="small" />} onClick={() => handleDelete(row)} ariaLabel="Delete" />
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Link href="#" underline="hover" sx={{ fontWeight: 500 }}>
                  View All Subscriptions &rarr;
                </Link>
              </Box>
            </>
          )}
        </Paper>
      </Box>

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
          <TextField 
            label="Category" 
            value={form.category} 
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))} 
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

      {/* Footer */}
      <Box sx={{ mt: 6, py: 3, textAlign: 'center', color: 'text.secondary', fontSize: 15, borderTop: '1px solid #ececec', background: '#fff' }}>
        Made with <span style={{ color: '#2196f3', fontWeight: 700 }}>Yisily</span> &copy; {new Date().getFullYear()}
      </Box>
    </Box>
  );
} 