"use client";

import { useState, useEffect } from "react";
import { Subscription } from "@/types/subscription";
import { SubscriptionList } from "@/components/subscriptions/SubscriptionList";
import { SubscriptionFormWrapper } from "@/components/subscriptions/SubscriptionFormWrapper";
import { MonthlySpendChart } from "@/components/charts/MonthlySpendChart";
import { FilterSidesheet } from "@/components/filters/FilterSidesheet";
import { UpcomingCalendar } from "@/components/calendar/UpcomingCalendar";
import { ProfileMenu } from "@/components/auth/ProfileMenu";

interface DashboardContentProps {
  subscriptions: Subscription[];
  totalMonthlySpend: number;
  totalYearlySpend: number;
  totalOneTimeExpenses: number;
  userName: string;
}

export function DashboardContent({ 
  subscriptions: initialSubscriptions, 
  totalMonthlySpend, 
  totalYearlySpend, 
  totalOneTimeExpenses,
  userName 
}: DashboardContentProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBillingCycles, setSelectedBillingCycles] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [activeTab, setActiveTab] = useState<"list" | "chart" | "calendar" | "reports">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch filtered subscriptions from API
  const fetchFilteredSubscriptions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (selectedCategories.length > 0) {
        params.append('categories', selectedCategories.join(','));
      }
      if (selectedBillingCycles.length > 0) {
        params.append('billingCycles', selectedBillingCycles.join(','));
      }
      if (selectedFrequencies.length > 0) {
        params.append('frequencies', selectedFrequencies.join(','));
      }
      if (amountRange.min) {
        params.append('minAmount', amountRange.min);
      }
      if (amountRange.max) {
        params.append('maxAmount', amountRange.max);
      }

      const response = await fetch(`/api/subscriptions?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      } else {
        console.error('Failed to fetch filtered subscriptions');
      }
    } catch (error) {
      console.error('Error fetching filtered subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters when the apply button is clicked
  const handleApplyFilters = () => {
    fetchFilteredSubscriptions();
  };

  const handleOpenModal = () => {
    setModalMode("add");
    setEditingSubscription(null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setModalMode("edit");
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete subscription");
      }

      // Update local state instead of reloading the page
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
      
      // Show success message (you can implement a proper toast notification here)
      console.log("Subscription deleted successfully!");
    } catch (error) {
      console.error("Error deleting subscription:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete subscription. Please try again.";
      console.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Trackify</h1>
              <span className="text-sm text-gray-500">Smart Finance & Subscription Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <ProfileMenu userName={userName} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Sticky */}
        <div className="sticky top-16 z-10 bg-gray-50 pt-2 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Spend</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${totalMonthlySpend.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Yearly Spend</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${totalYearlySpend.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {subscriptions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599 1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">One-Time Expenses</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${totalOneTimeExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

                {/* Tab Navigation and Action Buttons - Sticky */}
        <div className="sticky top-48 z-10 bg-gray-50 pt-2 pb-4 flex justify-between items-center">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveTab("list")}
              className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("chart")}
              className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "chart"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "calendar"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeTab === "reports"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reports
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <FilterSidesheet
              selectedCategories={selectedCategories}
              selectedBillingCycles={selectedBillingCycles}
              selectedFrequencies={selectedFrequencies}
              amountRange={amountRange}
              onCategoryChange={setSelectedCategories}
              onBillingCycleChange={setSelectedBillingCycles}
              onFrequencyChange={setSelectedFrequencies}
              onAmountRangeChange={setAmountRange}
              onApplyFilters={handleApplyFilters}
            />
            <div className="w-2.5"></div>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Subscription
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Main Content Area */}
          <div>
            {activeTab === "list" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[calc(100vh-280px)] flex flex-col">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Subscriptions & Bills
                    {(selectedCategories.length > 0 || selectedBillingCycles.length > 0 || selectedFrequencies.length > 0 || amountRange.min || amountRange.max) && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Filtered - {subscriptions.length} result{subscriptions.length === 1 ? '' : 's'})
                      </span>
                    )}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SubscriptionList 
                    subscriptions={subscriptions} 
                    isLoading={isLoading}
                    onAddSubscription={handleOpenModal}
                    onEditSubscription={handleEditSubscription}
                    onDeleteSubscription={handleDeleteSubscription}
                  />
                </div>
              </div>
            )}

            {activeTab === "chart" && (
              <div>
                <MonthlySpendChart subscriptions={subscriptions} />
              </div>
            )}

            {activeTab === "calendar" && (
              <div>
                <UpcomingCalendar subscriptions={subscriptions} />
              </div>
            )}

            {activeTab === "reports" && (
              <div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Reports</h2>
                  <p className="text-gray-600">Reports feature coming soon...</p>
                </div>
              </div>
            )}


          </div>
        </div>
      </main>

      {/* Subscription Form Modal */}
      <SubscriptionFormWrapper 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subscription={editingSubscription}
        mode={modalMode}
      />
    </div>
  );
} 