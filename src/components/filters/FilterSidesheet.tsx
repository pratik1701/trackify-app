"use client";

import { useState } from "react";
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  Typography, 
  Box, 
  Button,
  Divider,
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel
} from "@mui/material";
import { 
  Close as CloseIcon, 
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";
import { categories, billingCycles, frequencies } from "@/types/subscription";

interface FilterSidesheetProps {
  selectedCategories: string[];
  selectedBillingCycles: string[];
  selectedFrequencies: string[];
  amountRange: { min: string; max: string };
  onCategoryChange: (categories: string[]) => void;
  onBillingCycleChange: (billingCycles: string[]) => void;
  onFrequencyChange: (frequencies: string[]) => void;
  onAmountRangeChange: (range: { min: string; max: string }) => void;
  onApplyFilters: () => void;
}

export function FilterSidesheet({ 
  selectedCategories, 
  selectedBillingCycles,
  selectedFrequencies,
  amountRange,
  onCategoryChange, 
  onBillingCycleChange,
  onFrequencyChange,
  onAmountRangeChange,
  onApplyFilters
}: FilterSidesheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleCategory = (category: string) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(newSelectedCategories);
  };

  const handleToggleBillingCycle = (billingCycle: string) => {
    const newSelectedBillingCycles = selectedBillingCycles.includes(billingCycle)
      ? selectedBillingCycles.filter(b => b !== billingCycle)
      : [...selectedBillingCycles, billingCycle];
    onBillingCycleChange(newSelectedBillingCycles);
  };

  const handleToggleFrequency = (frequency: string) => {
    const newSelectedFrequencies = selectedFrequencies.includes(frequency)
      ? selectedFrequencies.filter(f => f !== frequency)
      : [...selectedFrequencies, frequency];
    onFrequencyChange(newSelectedFrequencies);
  };

  const handleSelectAll = () => {
    onCategoryChange([...categories]);
    onBillingCycleChange(billingCycles.map(bc => bc.value));
    onFrequencyChange(frequencies.map(f => f.value));
  };

  const handleClearAll = () => {
    onCategoryChange([]);
    onBillingCycleChange([]);
    onFrequencyChange([]);
    onAmountRangeChange({ min: '', max: '' });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleApplyFilters = () => {
    onApplyFilters();
    setIsOpen(false);
  };

  const getCategoryGroup = (category: string) => {
    if (["Streaming", "Gaming", "Music", "News", "Entertainment"].includes(category)) {
      return "Entertainment & Media";
    }
    if (["Software", "Productivity", "Cloud Services", "Security"].includes(category)) {
      return "Software & Technology";
    }
    if (["Fitness", "Health", "Wellness"].includes(category)) {
      return "Health & Fitness";
    }
    if (["Education", "Learning", "Professional Development"].includes(category)) {
      return "Education & Learning";
    }
    if (["Mortgage", "Rent", "Utilities", "Insurance", "Loan", "Credit Card", "Investment", "Tax"].includes(category)) {
      return "Finance & Bills";
    }
    if (["Transportation", "Fuel", "Parking", "Public Transit"].includes(category)) {
      return "Transportation";
    }
    if (["Shopping", "Retail", "Membership"].includes(category)) {
      return "Shopping & Retail";
    }
    return "Other";
  };

  const groupedCategories = categories.reduce((acc, category) => {
    const group = getCategoryGroup(category);
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(category);
    return acc;
  }, {} as Record<string, string[]>);

  const getTotalFilterCount = () => {
    return selectedCategories.length + selectedBillingCycles.length + selectedFrequencies.length + 
           (amountRange.min ? 1 : 0) + (amountRange.max ? 1 : 0);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={() => setIsOpen(true)}
        sx={{
          borderColor: getTotalFilterCount() > 0 ? 'primary.main' : 'grey.300',
          color: getTotalFilterCount() > 0 ? 'primary.main' : 'grey.700',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
          }
        }}
      >
        Filters
        {getTotalFilterCount() > 0 && (
          <Box
            component="span"
            sx={{
              ml: 1,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: 'primary.main',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            {getTotalFilterCount()}
          </Box>
        )}
      </Button>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: '90vw',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Filter Categories
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleSelectAll}
              sx={{ flex: 1 }}
            >
              Select All
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearAll}
              sx={{ flex: 1 }}
            >
              Clear All
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            {/* Categories */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Categories ({selectedCategories.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {Object.entries(groupedCategories).map(([groupName, groupCategories]) => (
                    <Box key={groupName}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          px: 2,
                          py: 1,
                          backgroundColor: 'grey.50',
                          fontWeight: 'bold',
                          color: 'grey.700',
                        }}
                      >
                        {groupName}
                      </Typography>
                      {groupCategories.map((category) => (
                        <ListItem
                          key={category}
                          dense
                          onClick={() => handleToggleCategory(category)}
                          sx={{ py: 0.5, cursor: 'pointer' }}
                        >
                          <Checkbox
                            checked={selectedCategories.includes(category)}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <ListItemText
                            primary={category}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { fontSize: '0.875rem' }
                            }}
                          />
                        </ListItem>
                      ))}
                      <Divider />
                    </Box>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Billing Cycles */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Billing Cycles ({selectedBillingCycles.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {billingCycles.map((billingCycle) => (
                    <ListItem
                      key={billingCycle.value}
                      dense
                      onClick={() => handleToggleBillingCycle(billingCycle.value)}
                      sx={{ py: 0.5, cursor: 'pointer' }}
                    >
                      <Checkbox
                        checked={selectedBillingCycles.includes(billingCycle.value)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <ListItemText
                        primary={billingCycle.label}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontSize: '0.875rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Frequencies */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Frequency ({selectedFrequencies.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {frequencies.map((frequency) => (
                    <ListItem
                      key={frequency.value}
                      dense
                      onClick={() => handleToggleFrequency(frequency.value)}
                      sx={{ py: 0.5, cursor: 'pointer' }}
                    >
                      <Checkbox
                        checked={selectedFrequencies.includes(frequency.value)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <ListItemText
                        primary={frequency.label}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontSize: '0.875rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Amount Range */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Amount Range
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Min Amount"
                    type="number"
                    value={amountRange.min}
                    onChange={(e) => onAmountRangeChange({ ...amountRange, min: e.target.value })}
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                  <TextField
                    label="Max Amount"
                    type="number"
                    value={amountRange.max}
                    onChange={(e) => onAmountRangeChange({ ...amountRange, max: e.target.value })}
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>,
                    }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'grey.200' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {getTotalFilterCount() === 0
                ? "No filters applied"
                : `${getTotalFilterCount()} filter${getTotalFilterCount() === 1 ? '' : 's'} applied`
              }
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
} 