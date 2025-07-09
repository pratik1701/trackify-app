import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { getDatabase } from "@/lib/database";
import { getAppSecrets } from "@/lib/secrets";

const subscriptionUpdateSchema = z.object({
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

// Create auth options for getServerSession
const createAuthOptions = async () => {
  const secrets = await getAppSecrets();
  return {
    secret: secrets.nextAuthSecret,
  };
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authOptions = await createAuthOptions();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate subscription ID format
    if (!params.id || params.id.length < 10) {
      return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 });
    }

    const prisma = await getDatabase();
    const body = await request.json();
    const validatedData = subscriptionUpdateSchema.parse(body);

    // Validate date format
    const dueDate = new Date(validatedData.nextDueDate + "T00:00:00");
    if (isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Check if subscription exists and belongs to the user
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingSubscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const subscription = await prisma.subscription.update({
      where: {
        id: params.id,
      },
      data: {
        name: validatedData.name,
        amount: validatedData.amount,
        category: validatedData.category,
        billingCycle: validatedData.billingCycle,
        frequency: validatedData.frequency,
        nextDueDate: dueDate,
        notes: validatedData.notes,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authOptions = await createAuthOptions();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate subscription ID format
    if (!params.id || params.id.length < 10) {
      return NextResponse.json({ error: "Invalid subscription ID" }, { status: 400 });
    }

    const prisma = await getDatabase();

    // Check if subscription exists and belongs to the user
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingSubscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    await prisma.subscription.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    );
  }
} 