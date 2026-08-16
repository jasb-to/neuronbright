import { NextResponse } from "next/server";
import { getCurrentOrganisationId } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(){
  try{
    const organisationId=await getCurrentOrganisationId(); if(!organisationId)return NextResponse.json({events:[]});
    const supabase=await getSupabaseServerClient(); if(!supabase)return NextResponse.json({error:"Supabase is not configured."},{status:500});
    const {data,error}=await supabase.from("audit_log").select("id,action,entity_type,entity_id,metadata,created_at,user_id").eq("organisation_id",organisationId).order("created_at",{ascending:false}).limit(100);
    if(error)throw new Error(error.message); return NextResponse.json({events:data??[]});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to load audit log."},{status:500});}
}
