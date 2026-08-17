import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export async function GET() {
  const access = await requirePlatformAdmin();
  if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 });
  const url = process.env.VERCEL_API_URL ?? "https://api.vercel.com/v6/deployments";
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return NextResponse.json({ configured: false, deployments: [], message: "VERCEL_API_TOKEN and VERCEL_PROJECT_ID are required." });
  const response = await fetch(`${url}?projectId=${encodeURIComponent(projectId)}&limit=10`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) return NextResponse.json({ configured: true, deployments: [], message: `Vercel API returned ${response.status}.` }, { status: 502 });
  const data = await response.json();
  return NextResponse.json({ configured: true, deployments: (data.deployments ?? []).map((d: { uid: string; name: string; state: string; created: number; url?: string; meta?: { githubCommitSha?: string; githubCommitMessage?: string } }) => ({ id: d.uid, name: d.name, state: d.state, created: d.created, url: d.url, commit: d.meta?.githubCommitSha, message: d.meta?.githubCommitMessage })) });
}
