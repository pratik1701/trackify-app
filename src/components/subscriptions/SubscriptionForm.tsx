"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  InputAdornment,
} from '@mui/material';
import { subscriptionFormSchema, subscriptionSubmitSchema, type SubscriptionFormData, type SubscriptionSubmitData, categories, billingCycles, frequencies, type Subscription } from "@/types/subscription";
import { Modal, Button, Input, Select } from '../common';

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionSubmitData) => Promise<void>;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
  mode?: "add" | "edit";
}

export function SubscriptionForm({ onSubmit, isLoading = false, isOpen, onClose, subscription, mode = "add" }: SubscriptionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: subscription?.name || "",
      amount: subscription?.amount?.toString() || "",
      category: subscription?.category || "",
      billingCycle: subscription?.billingCycle || "monthly",
      frequency: subscription?.frequency || "recurring",
      nextDueDate: subscription?.nextDueDate ? new Date(subscription.nextDueDate).toISOString().split('T')[0] : "",
      notes: subscription?.notes || "",
    },
  });

  // Reset form when subscription or mode changes
  useEffect(() => {
          if (subscription) {
        reset({
          name: subscription.name,
          amount: subscription.amount.toString(),
          category: subscription.category,
          billingCycle: subscription.billingCycle,
          frequency: subscription.frequency,
          nextDueDate: new Date(subscription.nextDueDate).toISOString().split('T')[0],
          notes: subscription.notes || "",
        });
      } else {
        reset({
          name: "",
          amount: "",
          category: "",
          billingCycle: "monthly",
          frequency: "recurring",
          nextDueDate: "",
          notes: "",
        });
      }
  }, [subscription, reset]);

  const handleFormSubmit = async (data: SubscriptionFormData) => {
    try {
      const validatedData = subscriptionSubmitSchema.parse(data);
      await onSubmit(validatedData);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={mode === "edit" ? "Edit Subscription" : "Add New Subscription"}
      maxWidth="md"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={isLoading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isLoading ? (mode === "edit" ? "Saving..." : "Adding...") : (mode === "edit" ? "Save Changes" : "Add Subscription")}
          </Button>
        </Box>
      }
    >
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Input
              {...register("name")}
              label="Subscription Name *"
              placeholder="e.g., Netflix, Spotify Pro"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Input
              {...register("amount")}
              label="Amount *"
              type="number"
              placeholder="0.00"
              error={!!errors.amount}
              helperText={errors.amount?.message}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{
                step: "0.01",
                min: "0",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Select
              {...register("category")}
              label="Category *"
              placeholder="Select a category"
              options={categories.map(category => ({ value: category, label: category }))}
              error={!!errors.category}
              helperText={errors.category?.message}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Select
              {...register("billingCycle")}
              label="Billing Cycle *"
              options={billingCycles.map(cycle => ({ value: cycle.value, label: cycle.label }))}
              error={!!errors.billingCycle}
              helperText={errors.billingCycle?.message}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Select
              {...register("frequency")}
              label="Frequency *"
              options={frequencies.map(freq => ({ value: freq.value, label: freq.label }))}
              error={!!errors.frequency}
              helperText={errors.frequency?.message}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Input
              {...register("nextDueDate")}
              label="Next Due Date *"
              type="date"
              error={!!errors.nextDueDate}
              helperText={errors.nextDueDate?.message}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </Box>

        <Box>
          <Input
            {...register("notes")}
            label="Notes"
            placeholder="Optional notes about this subscription..."
            error={!!errors.notes}
            helperText={errors.notes?.message}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </Box>
    </Modal>
  );
} 