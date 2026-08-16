import { NextResponse } from "next/server";
import { getCurrentOrganisationId, writeAuditLog } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(request: Request,{params}:{params:Promise<{id:string}>}){
  try{
    const organisationId=await getCurrentOrganisationId(); if(!organisationId)return NextResponse.json({error:"Authentication required."},{status:401});
    const {id}=await params; const body=await request.json(); const status=body.status;
    if(!["Open","In progress","Complete"].includes(status))return NextResponse.json({error:"Invalid status."},{status:400});
    const supabase=await getSupabaseServerClient(); if(!supabase)return NextResponse.json({error:"Supabase is not configured."},{status:500});
    const {data,error}=await supabase.from("remediation_tasks").update({status}).eq("id",id).eq("organisation_id",organisationId).select().single();
    if(error)throw new Error(error.message); await writeAuditLog({action:"updated",entityType:"remediation_task",entityId:id,metadata:{status}}); return NextResponse.json({task:data});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to update action."},{status:400});}
}
