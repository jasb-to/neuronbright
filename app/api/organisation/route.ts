import { NextResponse } from "next/server";
import { getCurrentOrganisationId } from "@/lib/supabase-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(){
 const id=await getCurrentOrganisationId(); if(!id)return NextResponse.json({organisation:null}); const supabase=await getSupabaseServerClient(); if(!supabase)return NextResponse.json({error:"Supabase is not configured."},{status:500}); const {data,error}=await supabase.from("organisations").select("id,name,industry,size,governance_lead,contact_email").eq("id",id).single(); if(error)return NextResponse.json({error:error.message},{status:500}); return NextResponse.json({organisation:data});
}

export async function PATCH(request:Request){
 const id=await getCurrentOrganisationId(); if(!id)return NextResponse.json({error:"Authentication required."},{status:401}); const body=await request.json(); const supabase=await getSupabaseServerClient(); if(!supabase)return NextResponse.json({error:"Supabase is not configured."},{status:500}); const {data,error}=await supabase.from("organisations").update({name:body.name,industry:body.industry,size:body.size,governance_lead:body.governanceLead,contact_email:body.contactEmail}).eq("id",id).select().single(); if(error)return NextResponse.json({error:error.message},{status:400}); return NextResponse.json({organisation:data});
}
