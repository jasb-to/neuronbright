import { NextResponse } from "next/server";
import { getOrganisationSystem } from "@/lib/supabase-data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const system = await getOrganisationSystem(id);
    if (!system) return NextResponse.json({ error: "AI system not found." }, { status: 404 });
    return NextResponse.json({ system });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load AI system." }, { status: 500 });
  }
}
