import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { getDatabase } from "@/lib/database";
import { authOptions } from "../auth/[...nextauth]/route";

const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  amount: z.number().positive("Amount must be positive").max(999999, "Amount too large"),
  category: z.string().min(1, "Category is required").max(50, "Category too long"),
  billingCycle: z.enum(["monthly", "yearly", "twoYear", "threeYear"]),
  frequency: z.enum(["oneTime", "recurring"]),
  nextDueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
});

// Sanitize error messages for production
const sanitizeError = (error: any) => {
  if (process.env.NODE_ENV === 'production') {
    return "An error occurred. Please try again.";
  }
  return error.message || "Internal server error";
};



export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getDatabase();
    const { searchParams } = new URL(request.url);
    const categories = searchParams.get('categories');
    const billingCycles = searchParams.get('billingCycles');
    const frequencies = searchParams.get('frequencies');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');

    // Validate and sanitize query parameters
    const whereClause: any = {
      userId: session.user.id,
    };

    // Filter by categories
    if (categories) {
      const categoryArray = categories.split(',').filter(cat => cat.length <= 50);
      if (categoryArray.length > 0) {
        whereClause.category = {
          in: categoryArray,
        };
      }
    }

    // Filter by billing cycles
    if (billingCycles) {
      const billingCycleArray = billingCycles.split(',').filter(cycle => 
        ['monthly', 'yearly', 'twoYear', 'threeYear'].includes(cycle)
      );
      if (billingCycleArray.length > 0) {
        whereClause.billingCycle = {
          in: billingCycleArray,
        };
      }
    }

    // Filter by frequencies
    if (frequencies) {
      const frequencyArray = frequencies.split(',').filter(freq => 
        ['oneTime', 'recurring'].includes(freq)
      );
      if (frequencyArray.length > 0) {
        whereClause.frequency = {
          in: frequencyArray,
        };
      }
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      whereClause.amount = {};
      if (minAmount) {
        const min = parseFloat(minAmount);
        if (!isNaN(min) && min >= 0) {
          whereClause.amount.gte = min;
        }
      }
      if (maxAmount) {
        const max = parseFloat(maxAmount);
        if (!isNaN(max) && max >= 0) {
          whereClause.amount.lte = max;
        }
      }
    }

    const subscriptions = await prisma.subscription.findMany({
      where: whereClause,
      orderBy: {
        nextDueDate: "asc",
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getDatabase();
    const body = await request.json();
    const validatedData = subscriptionSchema.parse(body);

    // Validate date format
    const dueDate = new Date(validatedData.nextDueDate + "T00:00:00");
    if (isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const subscription = await prisma.subscription.create({
      data: {
        name: validatedData.name,
        amount: validatedData.amount,
        category: validatedData.category,
        billingCycle: validatedData.billingCycle,
        frequency: validatedData.frequency,
        nextDueDate: dueDate,
        notes: validatedData.notes,
        userId: session.user.id,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    );
  }
} 