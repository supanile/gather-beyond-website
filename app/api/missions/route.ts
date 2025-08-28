import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

// Partner mapping
const PARTNER_ID_MAP: { [key: string]: number } = {
  "Super Connector": 2,
  Staika: 4,
  "Bread.gg": 7,
  "BTC Rush": 6,
  Deepbrew: 8,
  Dessistant: 9,
  "Maneki AI": 5,
  "TAMA TAMA": 3,
};

export async function GET() {
  try {
    const missions = await grist.fetchTable("Missions");

    if (!missions || missions.length === 0) {
      return NextResponse.json({ error: "No missions found" }, { status: 404 });
    }

    return NextResponse.json(missions, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch missions:", error);

    if (
      error instanceof Error &&
      error.message.includes("Network connection failed")
    ) {
      return NextResponse.json(
        {
          error:
            "Network connection failed. Please check your internet connection and Grist API configuration.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch missions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.GRIST_API_KEY) {
      console.error("Grist API Key not configured");
      return NextResponse.json(
        {
          error:
            "Grist API configuration missing. Please set GRIST_API_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("Received mission data:", body);
    console.log("=== DEBUG SERVERID ===");
    console.log("body.serverId:", body.serverId);
    console.log("body.serverId type:", typeof body.serverId);
    console.log("body.missionTargeting:", body.missionTargeting);
    console.log("body.missionTargeting?.discordFilters?.servers:", body.missionTargeting?.discordFilters?.servers);
    
    // Log all properties of body to see what's being sent
    console.log("=== ALL BODY PROPERTIES ===");
    console.log("Body keys:", Object.keys(body));
    for (const [key, value] of Object.entries(body)) {
      console.log(`${key}:`, value);
    }

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "type",
      "platform",
      "partner",
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate type
    const validTypes = [
      "Social",
      "Trading",
      "Community",
      "Referral",
      "Engagement",
    ];

    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error: `Invalid type: ${body.type}. Must be one of: ${validTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate platform with capitalized values
    const validPlatforms = ["Telegram", "X", "Discord", "Website", "Mobile"];
    if (!validPlatforms.includes(body.platform)) {
      return NextResponse.json(
        {
          error: `Invalid platform: ${
            body.platform
          }. Must be one of: ${validPlatforms.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Get partner ID from partner name
    const partnerId = PARTNER_ID_MAP[body.partner];
    if (!partnerId) {
      const validPartners = Object.keys(PARTNER_ID_MAP).join(", ");
      return NextResponse.json(
        {
          error: `Invalid partner: ${body.partner}. Must be one of: ${validPartners}`,
        },
        { status: 400 }
      );
    }

    console.log(`Partner "${body.partner}" mapped to ID: ${partnerId}`);
    const durationData = {
      start:
        body.startDate || new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      end: body.endDate || null,
    };

    console.log("Duration data created:", durationData);

    // Handle serverId properly - check missionTargeting first, then fallback to body.serverId
    let finalServerId = "[]";
    if (body.missionTargeting?.discordFilters?.servers && 
        Array.isArray(body.missionTargeting.discordFilters.servers) &&
        body.missionTargeting.discordFilters.servers.length > 0) {
      finalServerId = JSON.stringify(body.missionTargeting.discordFilters.servers);
      console.log("✅ Using servers from missionTargeting:", finalServerId);
    } else if (body.serverId && body.serverId !== "" && body.serverId !== "[]") {
      finalServerId = body.serverId;
      console.log("✅ Using body.serverId:", body.serverId);
    } else {
      console.log("✅ Using empty array (no servers found)");
    }
    
    console.log("🔥 Final serverId for POST:", finalServerId);

    // Prepare data for Grist
    const missionData = {
      title: body.title,
      description: body.description,
      type: body.type,
      platform: body.platform,
      reward: body.reward || JSON.stringify({ amount: 0, token: "XP" }),
      partner: partnerId,
      level_required: body.level_required || 1,
      action_request: body.action_request || "",
      format: body.format || "",
      useful_link: body.useful_link || "",
      requirements: body.requirements || JSON.stringify({}),
      duration: JSON.stringify(durationData, null, 0)
        .replace(/,"/g, ', "')
        .replace(/":"/g, '": "'),
      repeatable: body.repeatable || 0,
      regex: body.regex || "",
      serverId: finalServerId,
    };

    console.log("Prepared mission data for Grist:", missionData);
    console.log("Duration field:", missionData.duration);

    const result = await grist.addRecords("Missions", [missionData]);
    console.log("Grist response:", result);

    return NextResponse.json(
      { message: "Mission added successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add mission - Full error:", error);

    let errorMessage = "Failed to add mission";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: "Failed to add mission", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Mission ID is required for update" },
        { status: 400 }
      );
    }

    // Validate type if provided
    if (updateData.type) {
      const validTypes = [
        "Social",
        "Trading",
        "Community",
        "Referral",
        "Engagement",
      ];
      if (!validTypes.includes(updateData.type)) {
        return NextResponse.json(
          {
            error: `Invalid type: ${
              updateData.type
            }. Must be one of: ${validTypes.join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate platform with capitalized values
    if (updateData.platform) {
      const validPlatforms = ["Telegram", "X", "Discord", "Website", "Mobile"];
      if (!validPlatforms.includes(updateData.platform)) {
        return NextResponse.json(
          {
            error: `Invalid platform: ${
              updateData.platform
            }. Must be one of: ${validPlatforms.join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // Handle partner reference
    let partnerId = updateData.partner;
    if (typeof updateData.partner === "string") {
      partnerId = PARTNER_ID_MAP[updateData.partner];
      if (!partnerId) {
        const validPartners = Object.keys(PARTNER_ID_MAP).join(", ");
        return NextResponse.json(
          {
            error: `Invalid partner: ${updateData.partner}. Must be one of: ${validPartners}`,
          },
          { status: 400 }
        );
      }
      console.log(`Partner "${updateData.partner}" mapped to ID: ${partnerId}`);
    }

    // Handle duration properly for updates
    const cleanUpdateData = { ...updateData };
    delete cleanUpdateData.startDate;
    delete cleanUpdateData.endDate;
    delete cleanUpdateData.status;

    if (updateData.startDate || updateData.endDate) {
      let currentDuration: { start?: string; end?: string | null } = {};

      // Parse existing duration if it exists
      if (cleanUpdateData.duration) {
        try {
          currentDuration = JSON.parse(cleanUpdateData.duration);
        } catch {
          console.warn("Failed to parse existing duration, using empty object");
          currentDuration = {};
        }
      }

      const durationData = {
        ...currentDuration,
        start:
          updateData.startDate ||
          currentDuration.start ||
          new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
        end:
          updateData.endDate !== undefined
            ? updateData.endDate
            : currentDuration.end,
      };

      cleanUpdateData.duration = JSON.stringify(durationData, null, 0)
        .replace(/,"/g, ', "')
        .replace(/":"/g, '": "'); // Custom spacing
      console.log("Updated duration data:", durationData);
    }

    // Remove missionTargeting field to avoid errors
    delete cleanUpdateData.missionTargeting;

    // Handle serverId updates
    if (body.serverId !== undefined) {
      console.log("=== SERVERID UPDATE ===");
      console.log("Original body.serverId:", body.serverId);
      console.log("Type of serverId:", typeof body.serverId);
      
      // If serverId is already a JSON string, use it directly
      // If it's an array, convert it to JSON string
      if (typeof body.serverId === 'string') {
        cleanUpdateData.serverId = body.serverId;
      } else if (Array.isArray(body.serverId)) {
        cleanUpdateData.serverId = JSON.stringify(body.serverId);
      } else {
        // Default to empty array if undefined or invalid
        cleanUpdateData.serverId = "[]";
      }
      
      console.log("Final cleanUpdateData.serverId:", cleanUpdateData.serverId);
    }

    const finalUpdateData = {
      ...cleanUpdateData,
      partner: partnerId,
    };

    console.log("Final update data:", finalUpdateData);

    const result = await grist.updateRecords("Missions", [
      { id, ...finalUpdateData },
    ]);

    return NextResponse.json(
      { message: "Mission updated successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update mission:", error);
    return NextResponse.json(
      {
        error: "Failed to update mission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// route.ts - Improved DELETE method
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    console.log("=== DELETE API CALLED ===");
    console.log("Mission ID:", id);
    console.log("Full URL:", request.url);

    if (!id) {
      console.error("No mission ID provided");
      return NextResponse.json(
        { error: "Mission ID is required for deletion" },
        { status: 400 }
      );
    }

    if (!process.env.GRIST_API_KEY) {
      console.error("Grist API Key not configured");
      return NextResponse.json(
        { error: "Grist API configuration missing" },
        { status: 500 }
      );
    }

    // Verify mission exists before deletion
    try {
      console.log(`Checking if mission ${id} exists...`);
      const missions = await grist.fetchTable("Missions");
      const missionExists = missions.find((m) => String(m.id) === String(id));

      if (!missionExists) {
        console.log(`Mission ${id} not found in database`);
        return NextResponse.json(
          {
            error: "Mission not found",
            details: "The mission doesn't exist in the database",
          },
          { status: 404 }
        );
      }

      console.log(`Mission ${id} found:`, missionExists.title);
    } catch (fetchError) {
      console.error("Failed to verify mission existence:", fetchError);
      // Continue with deletion attempt anyway
    }

    // Delete the mission - now using the correct deleteRecords method
    console.log(`Attempting to delete mission ${id} from Grist...`);
    const result = await grist.deleteRecords("Missions", [parseInt(id)]);

    console.log("Delete operation successful:", result);

    return NextResponse.json(
      {
        message: "Mission deleted successfully",
        deletedId: id,
        success: true,
        data: result,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ DELETE API Error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );

    let errorMessage = "Failed to delete mission";
    let statusCode = 500;

    if (error instanceof Error) {
      console.error("Error message:", error.message);

      if (
        error.message.includes("404") ||
        error.message.includes("not found")
      ) {
        errorMessage = "Mission not found or already deleted";
        statusCode = 404;
      } else if (
        error.message.includes("403") ||
        error.message.includes("permission")
      ) {
        errorMessage = "Permission denied - insufficient privileges";
        statusCode = 403;
      } else if (
        error.message.includes("400") ||
        error.message.includes("invalid")
      ) {
        errorMessage = "Invalid mission ID format";
        statusCode = 400;
      } else if (
        error.message.includes("network") ||
        error.message.includes("connection")
      ) {
        errorMessage = "Network connection failed";
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
        missionId: new URL(request.url).searchParams.get("id"),
        success: false,
        timestamp: new Date().toISOString(),
      },
      {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
