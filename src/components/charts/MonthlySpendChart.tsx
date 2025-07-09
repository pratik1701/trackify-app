"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Subscription } from "@/types/subscription";

interface MonthlySpendChartProps {
  subscriptions: Subscription[];
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FFC658", "#FF6B6B", "#4ECDC4", "#45B7D1"
];

export function MonthlySpendChart({ subscriptions }: MonthlySpendChartProps) {
  // Calculate monthly spend by category
  const categorySpend = subscriptions.reduce((acc, sub) => {
    const monthlyAmount = sub.billingCycle === "monthly" 
      ? sub.amount 
      : sub.amount / 12;
    
    if (acc[sub.category]) {
      acc[sub.category] += monthlyAmount;
    } else {
      acc[sub.category] = monthlyAmount;
    }
    
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categorySpend).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spend by Category</h3>
        <div className="text-center py-8 text-gray-500">
          No subscriptions to display
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spend by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Monthly Spend']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 