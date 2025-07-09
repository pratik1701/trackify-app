import { z } from "zod";

export const subscriptionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  billingCycle: z.enum(["monthly", "yearly", "twoYear", "threeYear"]),
  frequency: z.enum(["oneTime", "recurring"]),
  nextDueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;

export const subscriptionSubmitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required").transform((val) => parseFloat(val)),
  category: z.string().min(1, "Category is required"),
  billingCycle: z.enum(["monthly", "yearly", "twoYear", "threeYear"]),
  frequency: z.enum(["oneTime", "recurring"]),
  nextDueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
});

export type SubscriptionSubmitData = z.infer<typeof subscriptionSubmitSchema>;

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  billingCycle: "monthly" | "yearly" | "twoYear" | "threeYear";
  frequency: "oneTime" | "recurring";
  nextDueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const categories = [
  // Entertainment & Media
  "Streaming",
  "Gaming",
  "Music",
  "News",
  "Entertainment",
  
  // Software & Technology
  "Software",
  "Productivity",
  "Cloud Services",
  "Security",
  
  // Health & Fitness
  "Fitness",
  "Health",
  "Wellness",
  
  // Education & Learning
  "Education",
  "Learning",
  "Professional Development",
  
  // Finance & Bills
  "Mortgage",
  "Rent",
  "Utilities",
  "Insurance",
  "Loan",
  "Credit Card",
  "Investment",
  "Tax",
  
  // Transportation
  "Transportation",
  "Fuel",
  "Parking",
  "Public Transit",
  
  // Shopping & Retail
  "Shopping",
  "Retail",
  "Membership",
  
  // Other
  "Other",
] as const;

export const billingCycles = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "twoYear", label: "2 Years" },
  { value: "threeYear", label: "3 Years" },
] as const;

export const frequencies = [
  { value: "recurring", label: "Recurring" },
  { value: "oneTime", label: "One Time" },
] as const; 