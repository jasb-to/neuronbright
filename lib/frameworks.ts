export type FrameworkId = "EU_AI_ACT" | "ISO_42001" | "NIST_AI_RMF";
export type FrameworkStatus = "Covered" | "Partial" | "Gap";
export type FrameworkRequirement = { id:string; framework:FrameworkId; code:string; title:string; description:string; mappedControl:string; evidence:string[] };
export type Framework = { id:FrameworkId; name:string; description:string; requirements:FrameworkRequirement[] };
export const frameworks:Framework[] = [
 { id:"EU_AI_ACT", name:"EU AI Act", description:"Risk-based regulatory requirements for providers and deployers of AI systems.", requirements:[
  {id:"EU-01",framework:"EU_AI_ACT",code:"RISK",title:"Risk management",description:"Identify, analyse and manage AI system risks throughout the lifecycle.",mappedControl:"Risk assessment and treatment",evidence:["Risk assessment","Risk treatment record"]},
  {id:"EU-02",framework:"EU_AI_ACT",code:"DATA",title:"Data and data governance",description:"Document data governance and relevant data quality practices where applicable.",mappedControl:"Data governance",evidence:["Data assessment","Data inventory"]},
  {id:"EU-03",framework:"EU_AI_ACT",code:"HUMAN",title:"Human oversight",description:"Define appropriate human oversight and intervention measures.",mappedControl:"Human oversight",evidence:["Oversight procedure","Training record"]},
  {id:"EU-04",framework:"EU_AI_ACT",code:"TRANSPARENCY",title:"Transparency",description:"Maintain required information and transparency measures for applicable systems.",mappedControl:"Transparency and disclosure",evidence:["User disclosure","System documentation"]}
 ]},
 { id:"ISO_42001", name:"ISO/IEC 42001", description:"AI management system requirements for responsible development and use of AI.", requirements:[
  {id:"ISO-01",framework:"ISO_42001",code:"AIMS",title:"AI management system",description:"Establish and continually improve an AI management system.",mappedControl:"AI governance programme",evidence:["AI policy","Governance charter"]},
  {id:"ISO-02",framework:"ISO_42001",code:"RISK",title:"AI risk assessment",description:"Assess AI risks and define treatment activities.",mappedControl:"Risk assessment and treatment",evidence:["Risk assessment","Risk register"]},
  {id:"ISO-03",framework:"ISO_42001",code:"IMPACT",title:"AI system impact assessment",description:"Assess relevant impacts and document decisions across the AI lifecycle.",mappedControl:"Impact assessment",evidence:["Impact assessment","Decision record"]},
  {id:"ISO-04",framework:"ISO_42001",code:"MONITOR",title:"Performance evaluation",description:"Monitor, measure and review the effectiveness of the AI management system.",mappedControl:"AI monitoring and review",evidence:["Review record","Monitoring report"]}
 ]},
 { id:"NIST_AI_RMF", name:"NIST AI RMF", description:"Voluntary AI risk management framework organised around Govern, Map, Measure and Manage.", requirements:[
  {id:"NIST-01",framework:"NIST_AI_RMF",code:"GOVERN",title:"Govern",description:"Establish organisational policies, processes and accountability for AI risk.",mappedControl:"AI governance programme",evidence:["AI policy","Governance charter"]},
  {id:"NIST-02",framework:"NIST_AI_RMF",code:"MAP",title:"Map",description:"Establish and document system context, purpose, impacts and risks.",mappedControl:"AI system assessment",evidence:["System inventory","Impact assessment"]},
  {id:"NIST-03",framework:"NIST_AI_RMF",code:"MEASURE",title:"Measure",description:"Measure and evaluate AI risks, performance and trustworthiness.",mappedControl:"AI testing and measurement",evidence:["Test report","Evaluation results"]},
  {id:"NIST-04",framework:"NIST_AI_RMF",code:"MANAGE",title:"Manage",description:"Prioritise, respond to and manage identified AI risks.",mappedControl:"Risk treatment and monitoring",evidence:["Risk treatment record","Monitoring report"]}
 ]}
];
export function getFramework(id:FrameworkId){return frameworks.find(f=>f.id===id)??frameworks[0];}
