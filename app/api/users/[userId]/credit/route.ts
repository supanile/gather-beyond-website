import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    userId: string;
  }>;
}

// GET: Fetch user's credit information
export async function GET(request: Request, { params }: Params) {
  const { userId } = await params;
  
  try {
    const users = await grist.fetchTable("Users", { discord_id: [userId] });
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    const creditData = {
      discord_id: user.discord_id,
      credit: Number(user.credit || user.total_points || 0),
      total_points: Number(user.total_points || 0), // Keep for backward compatibility
      last_updated: new Date().toISOString()
    };
    
    return NextResponse.json(creditData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user credit:", error);
    return NextResponse.json({ error: "Failed to fetch user credit" }, { status: 500 });
  }
}

// PUT: Update user's credit
export async function PUT(request: Request, { params }: Params) {
  const { userId } = await params;
  
  try {
    const body = await request.json();
    const { credit, operation = "set" } = body;

    if (typeof credit !== "number") {
      return NextResponse.json({ error: "Credit must be a number" }, { status: 400 });
    }

    // Fetch current user data
    const users = await grist.fetchTable("Users", { discord_id: [userId] });
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    let newCredit: number;

    switch (operation) {
      case "add":
        newCredit = Number(user.credit || user.total_points || 0) + credit;
        break;
      case "subtract":
        newCredit = Math.max(0, Number(user.credit || user.total_points || 0) - credit);
        break;
      case "set":
      default:
        newCredit = credit;
        break;
    }

    // Update the user's credit
    await grist.updateRecords("Users", [{
      id: user.id,
      credit: newCredit
    }]);

    const updatedCreditData = {
      discord_id: user.discord_id,
      credit: newCredit,
      previous_credit: Number(user.credit || user.total_points || 0),
      operation,
      change: operation === "set" ? newCredit : credit,
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json(updatedCreditData, { status: 200 });
  } catch (error) {
    console.error("Failed to update user credit:", error);
    return NextResponse.json({ error: "Failed to update user credit" }, { status: 500 });
  }
}
