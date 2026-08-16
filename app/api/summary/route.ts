import { NextResponse } from "next/server";
import { getCurrentOrganisationId } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(){
 try{
  const organisationId=await getCurrentOrganisationId(); if(!organisationId)return NextResponse.json({systems:[],evidence:[],actions:[]}); const supabase=await getSupabaseServerClient(); if(!supabase)return NextResponse.json({error:"Supabase is not configured."},{status:500});
  const [systems,evidence,actions]=await Promise.all([
   supabase.from("ai_systems").select("id,name,provider,model,owner,department,risk_level,status,evidence_score").eq("organisation_id",organisationId).order("created_at",{ascending:false}),
   supabase.from("evidence").select("id,status").eq("organisation_id",organisationId),
   supabase.from("remediation_tasks").select("id,status").eq("organisation_id",organisationId),
  ]);
  if(systems.error)throw new Error(systems.error.message); if(evidence.error)throw new Error(evidence.error.message); if(actions.error)throw new Error(actions.error.message);
  return NextResponse.json({systems:systems.data??[],evidence:evidence.data??[],actions:actions.data??[]});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to load governance summary."},{status:500});}
}
