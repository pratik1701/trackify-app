import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { nextDueDate: "asc" },
  }) as any[];

  // Calculate totals from all subscriptions (not filtered)
  const allSubscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { nextDueDate: "asc" },
  }) as any[];

  const totalMonthlySpend = allSubscriptions.reduce((total: any, sub: any) => {
    // Only include recurring items in monthly calculations
    if (sub.frequency === "oneTime") {
      return total;
    }
    
    switch (sub.billingCycle) {
      case "monthly":
        return total + sub.amount;
      case "yearly":
        return total + (sub.amount / 12);
      case "twoYear":
        return total + (sub.amount / 24);
      case "threeYear":
        return total + (sub.amount / 36);
      default:
        return total;
    }
  }, 0);

  const totalYearlySpend = allSubscriptions.reduce((total: any, sub: any) => {
    // Only include recurring items in yearly calculations
    if (sub.frequency === "oneTime") {
      return total;
    }
    
    switch (sub.billingCycle) {
      case "monthly":
        return total + (sub.amount * 12);
      case "yearly":
        return total + sub.amount;
      case "twoYear":
        return total + (sub.amount / 2);
      case "threeYear":
        return total + (sub.amount / 3);
      default:
        return total;
    }
  }, 0);

  // Calculate total one-time expenses
  const totalOneTimeExpenses = allSubscriptions.reduce((total: any, sub: any) => {
    return sub.frequency === "oneTime" ? total + sub.amount : total;
  }, 0);

  return (
    <DashboardContent
      subscriptions={subscriptions}
      totalMonthlySpend={totalMonthlySpend}
      totalYearlySpend={totalYearlySpend}
      totalOneTimeExpenses={totalOneTimeExpenses}
      userName={session?.user?.name || "User"}
    />
  );
} 