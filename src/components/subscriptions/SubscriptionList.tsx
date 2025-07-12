"use client";

import { Subscription } from "@/types/subscription";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { Button, Card } from '../common';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  onAddSubscription?: () => void;
  onEditSubscription?: (subscription: Subscription) => void;
  onDeleteSubscription?: (subscriptionId: string) => void;
}

export function SubscriptionList({ subscriptions, isLoading = false, onAddSubscription, onEditSubscription, onDeleteSubscription }: SubscriptionListProps) {
  if (isLoading) {
    return (
      <Stack spacing={2}>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Skeleton variant="text" width={200} height={24} />
                <Skeleton variant="text" width={150} height={20} />
              </Box>
              <Skeleton variant="rectangular" width={80} height={32} />
            </Box>
          </Card>
        ))}
      </Stack>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            bgcolor: 'grey.100',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DescriptionIcon sx={{ fontSize: 32, color: 'grey.400' }} />
        </Box>
        <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
          No subscriptions yet
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Add your first subscription to start tracking your expenses.
        </Typography>
        {onAddSubscription && (
          <Button
            variant="primary"
            startIcon={<AddIcon />}
            onClick={onAddSubscription}
          >
            Add Your First Subscription
          </Button>
        )}
      </Box>
    );
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return "error";
    if (daysUntilDue <= 7) return "warning";
    if (daysUntilDue <= 30) return "info";
    return "success";
  };

  const getStatusText = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return "Overdue";
    if (daysUntilDue === 0) return "Due today";
    if (daysUntilDue === 1) return "Due tomorrow";
    if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;
    if (daysUntilDue <= 30) return `Due in ${daysUntilDue} days`;
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <Stack spacing={2} sx={{ minHeight: 0 }}>
      {subscriptions.map((subscription) => {
        const daysUntilDue = getDaysUntilDue(subscription.nextDueDate);
        const statusColor = getStatusColor(daysUntilDue);
        const statusText = getStatusText(daysUntilDue);

        return (
          <Card
            key={subscription.id}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 3,
              },
              transition: 'box-shadow 0.2s ease-in-out',
            }}
            onClick={() => onEditSubscription?.(subscription)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" component="h3">
                    {subscription.name}
                  </Typography>
                  <Chip
                    label={subscription.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                
                <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      ${subscription.amount.toFixed(2)}/{subscription.billingCycle}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <RefreshIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {subscription.frequency === "recurring" ? "Recurring" : "One Time"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(subscription.nextDueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
                
                {subscription.notes && (
                  <Typography variant="body2" color="text.secondary">
                    {subscription.notes}
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Chip
                  label={statusText}
                  color={statusColor}
                  size="small"
                  variant="filled"
                />
                
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSubscription?.(subscription);
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this subscription?")) {
                        onDeleteSubscription?.(subscription.id);
                      }
                    }}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          </Card>
        );
      })}
    </Stack>
  );
} 