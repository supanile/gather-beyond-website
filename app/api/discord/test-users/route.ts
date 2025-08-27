import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await grist.fetchTable("Users");
    
    if (!users || users.length === 0) {
      return NextResponse.json({ 
        message: "No users found in database",
        users: [],
        total: 0
      }, { status: 200 });
    }

    // ส่งคืนเฉพาะข้อมูลที่จำเป็นเพื่อการทดสอบ (ไม่เอาข้อมูลส่วนตัวทั้งหมด)
    const safeUsers = users.map((user: any) => ({
      userId: String(user.id || user._id || ''),
      discordId: String(user.discord_id || ''),
      email: user.email ? String(user.email) : 'No email',
      missionsCompleted: user.missions_completed || 0,
      totalPoints: user.total_points || 0,
    }));
    
    return NextResponse.json({
      success: true,
      users: safeUsers,
      total: safeUsers.length,
      message: `Found ${safeUsers.length} users in database`
    });

  } catch (error) {
    console.error("Failed to fetch users for testing:", error);
    return NextResponse.json({ 
      error: "Failed to fetch users",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
