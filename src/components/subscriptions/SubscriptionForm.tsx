"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { subscriptionFormSchema, subscriptionSubmitSchema, type SubscriptionFormData, type SubscriptionSubmitData, categories, billingCycles, frequencies, type Subscription } from "@/types/subscription";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === "edit" ? "Edit Subscription" : "Add New Subscription"}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Name *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="e.g., Netflix, Spotify Pro"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    {...register("amount")}
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("category")}
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Cycle *
                </label>
                <select
                  {...register("billingCycle")}
                  id="billingCycle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  {billingCycles.map((cycle) => (
                    <option key={cycle.value} value={cycle.value}>
                      {cycle.label}
                    </option>
                  ))}
                </select>
                {errors.billingCycle && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingCycle.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  {...register("frequency")}
                  id="frequency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  {frequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
                {errors.frequency && (
                  <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="nextDueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Next Due Date *
                </label>
                <input
                  {...register("nextDueDate")}
                  type="date"
                  id="nextDueDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                {errors.nextDueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.nextDueDate.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  {...register("notes")}
                  id="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Optional notes about this subscription..."
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (mode === "edit" ? "Saving..." : "Adding...") : (mode === "edit" ? "Save Changes" : "Add Subscription")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 