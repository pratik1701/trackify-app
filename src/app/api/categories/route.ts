import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getDatabase } from "@/lib/database";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getDatabase();
    
    // Get unique categories for the current user
    const categories = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    // Extract category names and add some common categories
    const categoryNames = categories.map(cat => cat.category);
    
    // Add common categories if they don't exist
    const commonCategories = [
      'Streaming',
      'Software',
      'Utilities',
      'Health',
      'Education',
      'Gaming',
      'Music',
      'Cloud Storage',
      'Internet',
      'Phone',
      'Insurance',
      'Gym',
      'Food Delivery',
      'Shopping',
      'Transportation'
    ];

    const allCategories = [...new Set([...categoryNames, ...commonCategories])].sort();

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
} 