import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const users = await grist.fetchTable("Users");
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
  
}