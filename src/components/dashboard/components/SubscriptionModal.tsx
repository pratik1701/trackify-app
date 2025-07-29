import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useCreateSubscription, useUpdateSubscription, useCategories, type Subscription, type CreateSubscriptionData } from "@/hooks/useSubscriptions";

interface SubscriptionModalProps {
  open: boolean;
  editSubscription: Subscription | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function SubscriptionModal({ 
  open, 
  editSubscription, 
  onClose, 
  onSuccess, 
  onError 
}: SubscriptionModalProps) {
  const createSubscriptionMutation = useCreateSubscription();
  const updateSubscriptionMutation = useUpdateSubscription();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const [form, setForm] = React.useState<CreateSubscriptionData>({
    name: "",
    amount: 0,
    category: "",
    billingCycle: "monthly",
    frequency: "recurring",
    nextDueDate: "",
    notes: ""
  });

  // Update form when editSubscription changes
  React.useEffect(() => {
    if (editSubscription) {
      setForm({
        name: editSubscription.name,
        amount: editSubscription.amount,
        category: editSubscription.category,
        billingCycle: editSubscription.billingCycle,
        frequency: editSubscription.frequency,
        nextDueDate: new Date(editSubscription.nextDueDate).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        notes: editSubscription.notes || ""
      });
    } else {
      setForm({
        name: "",
        amount: 0,
        category: "",
        billingCycle: "monthly",
        frequency: "recurring",
        nextDueDate: "",
        notes: ""
      });
    }
  }, [editSubscription, open]);

  const handleSave = async () => {
    try {
      if (editSubscription) {
        await updateSubscriptionMutation.mutateAsync({
          ...form,
          id: editSubscription.id
        });
        onSuccess("Subscription updated!");
      } else {
        await createSubscriptionMutation.mutateAsync(form);
        onSuccess("Subscription added!");
      }
      onClose();
    } catch (error) {
      onError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const isLoading = createSubscriptionMutation.isPending || updateSubscriptionMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editSubscription ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
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
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : (editSubscription ? "Save" : "Add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 