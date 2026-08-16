import { NextResponse } from "next/server";
import { createGovernanceRecord } from "@/lib/supabase-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const record = await createGovernanceRecord(body);
    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save governance record." }, { status: 400 });
  }
}
