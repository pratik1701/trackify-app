"use client";

import { useState } from "react";
import { Subscription } from "@/types/subscription";

interface UpcomingCalendarProps {
  subscriptions: Subscription[];
}

export function UpcomingCalendar({ subscriptions }: UpcomingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month's start and end dates
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // Generate calendar days
  const calendarDays = [];
  const current = new Date(startDate);
  
  while (current <= lastDay || current.getDay() !== 0) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Get subscriptions due on a specific date
  const getSubscriptionsForDate = (date: Date) => {
    return subscriptions.filter(sub => {
      const dueDate = new Date(sub.nextDueDate);
      return dueDate.getDate() === date.getDate() &&
             dueDate.getMonth() === date.getMonth() &&
             dueDate.getFullYear() === date.getFullYear();
    });
  };

  // Navigate to previous/next month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Subscriptions</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-900">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = date.toDateString() === new Date().toDateString();
          const daySubscriptions = getSubscriptionsForDate(date);

          return (
            <div
              key={index}
              className={`
                min-h-[80px] p-1 border border-gray-100 text-xs
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="text-right mb-1">
                <span className={isToday ? 'bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : ''}>
                  {date.getDate()}
                </span>
              </div>
              <div className="space-y-1">
                {daySubscriptions.slice(0, 2).map(sub => (
                  <div
                    key={sub.id}
                    className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs truncate"
                    title={`${sub.name} - $${sub.amount}`}
                  >
                    {sub.name}
                  </div>
                ))}
                {daySubscriptions.length > 2 && (
                  <div className="text-gray-500 text-xs">
                    +{daySubscriptions.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 