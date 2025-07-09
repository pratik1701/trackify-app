"use client";

import { Subscription } from "@/types/subscription";

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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
        <p className="text-gray-500 mb-6">Add your first subscription to start tracking your expenses.</p>
        {onAddSubscription && (
          <button
            onClick={onAddSubscription}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Subscription
          </button>
        )}
      </div>
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
    if (daysUntilDue < 0) return "text-red-600 bg-red-50";
    if (daysUntilDue <= 7) return "text-orange-600 bg-orange-50";
    if (daysUntilDue <= 30) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
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
    <div className="space-y-4 min-h-0">
      {subscriptions.map((subscription) => {
        const daysUntilDue = getDaysUntilDue(subscription.nextDueDate);
        const statusColor = getStatusColor(daysUntilDue);
        const statusText = getStatusText(daysUntilDue);

        return (
          <div 
            key={subscription.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onEditSubscription?.(subscription)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {subscription.category}
                  </span>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    ${subscription.amount.toFixed(2)}/{subscription.billingCycle}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {subscription.frequency === "recurring" ? "Recurring" : "One Time"}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(subscription.nextDueDate).toLocaleDateString()}
                  </span>
                </div>
                {subscription.notes && (
                  <p className="mt-2 text-sm text-gray-600">{subscription.notes}</p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                  {statusText}
                </span>
                <div className="flex space-x-2">
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSubscription?.(subscription);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this subscription?")) {
                        onDeleteSubscription?.(subscription.id);
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 