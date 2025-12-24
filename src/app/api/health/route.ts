import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Attempt to query the database (Simple count)
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: "Healthy", 
      message: "Database connection successful", 
      userCount: userCount 
    }, { status: 200 });

  } catch (error) {
    console.error("Database Connection Error:", error);
    return NextResponse.json({ 
      status: "Error", 
      message: "Failed to connect to database", 
      error: String(error) 
    }, { status: 500 });
  }
}