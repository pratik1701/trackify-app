import React from "react";
import Box from "@mui/material/Box";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { StatCard } from "../../common/StatCard";
import { Subscription } from "@/types/subscription";

interface StatCardContainerProps {
  subscriptions: Subscription[];
  totalMonthlySpend: number;
}

export function StatCardContainer({ subscriptions, totalMonthlySpend }: StatCardContainerProps) {
  // Calculate stats from props
  const upcomingBillsCount = subscriptions.filter(sub => {
    const dueDate = new Date(sub.nextDueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const avgBillAmount = subscriptions.length > 0 
    ? subscriptions.reduce((sum, sub) => sum + sub.amount, 0) / subscriptions.length 
    : 0;

  const dynamicStats = [
    {
      icon: <AttachMoneyIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
      iconBg: '#e9f3ff',
      label: "Total Monthly Spend",
      value: `$${totalMonthlySpend.toFixed(2)}`,
      sublabel: { text: "Estimated recurring spend", color: '#64748b' },
    },
    {
      icon: <CalendarMonthIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
      iconBg: '#e9f3ff',
      label: "Upcoming Bills (7 Days)",
      value: upcomingBillsCount,
      sublabel: { text: "Bills due in the next week", color: '#64748b' },
    },
    {
      icon: <SubscriptionsIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
      iconBg: '#e9f3ff',
      label: "Active Subscriptions",
      value: subscriptions.length,
      sublabel: { text: "Currently active services", color: '#64748b' },
    },
    {
      icon: <ReceiptLongIcon sx={{ color: '#2196f3', fontSize: 28 }} />,
      iconBg: '#e9f3ff',
      label: "Avg. Bill Amount",
      value: `$${avgBillAmount.toFixed(2)}`,
      sublabel: { text: "Average cost per subscription", color: '#64748b' },
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1, px: 4, mb: 3, flexWrap: 'wrap', pt: 4, justifyContent:'space-between', flexDirection: { xs: 'column', sm: 'row' } }}>
      {dynamicStats.map((stat, idx) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          iconBg={stat.iconBg}
          label={stat.label}
          value={stat.value}
          sublabel={stat.sublabel}
          sx={{ borderRadius: 5, width: { xs: 'auto', sm: 275, md: 325 }, maxWidth: 400}}
        />
      ))}
    </Box>
  );
} 