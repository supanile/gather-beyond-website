import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

// Mock data generator for credits usage
const generateMockCreditsData = () => {
  const expenseTypes = ["mystery_box", "upgrade", "purchase", "other"];
  const expenseReasons = [
    "Bought Mystery Box",
    "Agent Upgrade",
    "Health Potion",
    "Skill Boost",
    "Premium Feature",
    "Special Item",
  ];

  return {
    credits_used_lifetime: Math.floor(Math.random() * 5000) + 100,
    credits_used_30d: Math.floor(Math.random() * 500) + 10,
    last_expense_reason:
      expenseReasons[Math.floor(Math.random() * expenseReasons.length)],
    last_expense_date:
      Math.floor(Date.now() / 1000) -
      Math.floor(Math.random() * 30 * 24 * 60 * 60), // Random within last 30 days
    last_expense_type:
      expenseTypes[Math.floor(Math.random() * expenseTypes.length)],
  };
};

export async function GET() {
  try {
    const userAgents = await grist.fetchTable("User_agents");

    if (!userAgents || userAgents.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Add mock credits data to each user agent
    const userAgentsWithMockData = userAgents.map((agent) => {
      const mockData = generateMockCreditsData();
      const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

      // If last expense is older than 30 days, clear the expense data
      const expenseData =
        mockData.last_expense_date >= thirtyDaysAgo
          ? {
              last_expense_reason: mockData.last_expense_reason,
              last_expense_date: mockData.last_expense_date,
              last_expense_type: mockData.last_expense_type,
            }
          : {
              last_expense_reason: null,
              last_expense_date: null,
              last_expense_type: null,
            };

      return {
        ...agent,
        credits_used_lifetime: mockData.credits_used_lifetime,
        credits_used_30d: mockData.credits_used_30d,
        ...expenseData,
      };
    });

    return NextResponse.json(userAgentsWithMockData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch user agents" },
      { status: 500 }
    );
  }
}