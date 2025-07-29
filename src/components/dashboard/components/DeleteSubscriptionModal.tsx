import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useDeleteSubscription, type Subscription } from "@/hooks/useSubscriptions";

interface DeleteSubscriptionModalProps {
  subscription: Subscription | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function DeleteSubscriptionModal({ 
  subscription, 
  onClose, 
  onSuccess, 
  onError 
}: DeleteSubscriptionModalProps) {
  const deleteSubscriptionMutation = useDeleteSubscription();

  const handleConfirm = async () => {
    if (!subscription) return;
    
    try {
      await deleteSubscriptionMutation.mutateAsync(subscription.id);
      onSuccess("Subscription deleted!");
      onClose();
    } catch (error) {
      onError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <Dialog open={!!subscription} onClose={onClose} maxWidth="xs">
      <DialogTitle>Delete Subscription</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <b>{subscription?.name}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleteSubscriptionMutation.isPending}>
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="error" 
          variant="contained"
          disabled={deleteSubscriptionMutation.isPending}
        >
          {deleteSubscriptionMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 