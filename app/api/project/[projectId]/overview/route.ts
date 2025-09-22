import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  const { projectId } = params;

  const foundProject = await grist.fetchTable("Projects", { id: [parseInt(projectId)] });
  if (!foundProject || foundProject.length === 0) {
    return { error: "Project not found" };
  }

  const categoryData = JSON.parse(foundProject[0].categories?.toString() || '[]');
  const websiteData = JSON.parse(foundProject[0].website?.toString() || '[]');

  const project = foundProject[0];
  const data = {
    ...project,
    categories: categoryData,
    website: websiteData
  }
  return NextResponse.json(data, { status: 200 });
}