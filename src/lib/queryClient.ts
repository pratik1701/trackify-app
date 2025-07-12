import { QueryClient } from '@tanstack/react-query';
import { Subscription } from '@/hooks/useSubscriptions';

export const prefetchSubscriptions = async (queryClient: QueryClient, subscriptions: Subscription[]) => {
  await queryClient.prefetchQuery({
    queryKey: ['subscriptions'],
    queryFn: () => Promise.resolve(subscriptions),
    staleTime: 60 * 1000, // 1 minute
  });
}; 