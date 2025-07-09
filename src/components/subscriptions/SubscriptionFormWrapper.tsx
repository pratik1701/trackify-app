"use client";

import { useState } from "react";
import { SubscriptionForm } from "./SubscriptionForm";
import { type SubscriptionSubmitData, type Subscription } from "@/types/subscription";

interface SubscriptionFormWrapperProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubscriptionAdded?: () => void;
  subscription?: Subscription | null;
  mode?: "add" | "edit";
}

export function SubscriptionFormWrapper({ isOpen = false, onClose, onSubscriptionAdded, subscription, mode = "add" }: SubscriptionFormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SubscriptionSubmitData) => {
    setIsSubmitting(true);
    try {
      const url = mode === "edit" && subscription 
        ? `/api/subscriptions/${subscription.id}` 
        : "/api/subscriptions";
      
      const method = mode === "edit" ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show success message (you can implement a proper toast notification here)
        console.log(`Subscription ${mode === "edit" ? "updated" : "added"} successfully!`);
        
        // Close modal and refresh data instead of reloading the page
        onClose?.();
        if (onSubscriptionAdded) {
          onSubscriptionAdded();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${mode} subscription`);
      }
    } catch (error) {
      console.error(`Error ${mode}ing subscription:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to ${mode} subscription. Please try again.`;
      console.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SubscriptionForm 
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
      isOpen={isOpen}
      onClose={onClose || (() => {})}
      subscription={subscription}
      mode={mode}
    />
  );
} 