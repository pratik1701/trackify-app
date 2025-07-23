import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "@mui/material/Link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { StatusChip } from "../../common/StatusChip";
import { ActionButton } from "../../common/ActionButton";
import Tooltip from "@mui/material/Tooltip";
import { Subscription } from "@/hooks/useSubscriptions";

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

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: SubscriptionTableProps) {
  return (
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
                              <ActionButton icon={<EditIcon fontSize="small" />} onClick={() => onEdit(row)} ariaLabel="Edit" />
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <span>
                              <ActionButton icon={<DeleteIcon fontSize="small" />} onClick={() => onDelete(row)} ariaLabel="Delete" />
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
  );
} 