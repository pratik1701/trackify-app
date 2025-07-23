import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  billingCycle: 'monthly' | 'yearly' | 'twoYear' | 'threeYear';
  frequency: 'oneTime' | 'recurring';
  nextDueDate: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionData {
  name: string;
  amount: number;
  category: string;
  billingCycle: 'monthly' | 'yearly' | 'twoYear' | 'threeYear';
  frequency: 'oneTime' | 'recurring';
  nextDueDate: string;
  notes?: string;
}

export interface UpdateSubscriptionData extends CreateSubscriptionData {
  id: string;
}

// API functions
const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const response = await fetch('/api/subscriptions');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch subscriptions');
  }

  return response.json();
};

const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch('/api/categories');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch categories');
  }

  return response.json();
};

const createSubscription = async (data: CreateSubscriptionData): Promise<Subscription> => {
  const response = await fetch('/api/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create subscription');
  }

  return response.json();
};

const updateSubscription = async (data: UpdateSubscriptionData): Promise<Subscription> => {
  const response = await fetch(`/api/subscriptions/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update subscription');
  }

  return response.json();
};

const deleteSubscription = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`/api/subscriptions/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete subscription');
  }

  return response.json();
};

// React Query hooks
export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchSubscriptions,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      // Invalidate and refetch subscriptions
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubscription,
    onSuccess: () => {
      // Invalidate and refetch subscriptions
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      // Invalidate and refetch subscriptions
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}; 