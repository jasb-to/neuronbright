"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Boxes, CheckSquare, FileCheck2, FileText, LayoutDashboard, Settings, Shield, Building2 } from "lucide-react";
import type { ReactNode } from "react";
import { Brand } from "./brand";

const primaryNavigation = [
  { name: "Control Centre", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Systems", href: "/systems", icon: Boxes },
  { name: "Vendors", href: "/vendors", icon: Building2 },
  { name: "Evidence Centre", href: "/evidence", icon: FileCheck2 },
];

const governanceNavigation = [
  { name: "Controls", href: "/controls", icon: Shield },
  { name: "Action Centre", href: "/actions", icon: CheckSquare },
  { name: "Monitoring", href: "/monitoring", icon: Activity },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.08] bg-[#090909] lg:flex lg:flex-col">
        <div className="border-b border-white/[0.08] px-5 py-5"><Brand /></div>
        <div className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[9px] uppercase tracking-[0.2em] text-white/20">Platform</p>
          <nav className="space-y-1">{primaryNavigation.map((item) => { const Icon=item.icon; const active=pathname===item.href||pathname.startsWith(`${item.href}/`); return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active?"bg-[#dc6b27]/10 text-[#dc6b27]":"text-white/45 hover:bg-white/[0.04] hover:text-white"}`}><Icon size={16}/>{item.name}</Link>; })}</nav>
          <p className="mb-3 mt-8 px-3 text-[9px] uppercase tracking-[0.2em] text-white/20">Governance</p>
          <nav className="space-y-1">{governanceNavigation.map((item) => { const Icon=item.icon; const active=pathname===item.href||pathname.startsWith(`${item.href}/`); return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active?"bg-[#dc6b27]/10 text-[#dc6b27]":"text-white/45 hover:bg-white/[0.04] hover:text-white"}`}><Icon size={16}/>{item.name}</Link>; })}</nav>
        </div>
        <div className="border-t border-white/[0.08] p-4"><div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3"><p className="text-[9px] uppercase tracking-[0.16em] text-white/25">Environment</p><div className="mt-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#dc6b27]"/><span className="text-xs text-white/60">Production</span></div></div></div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#070707]/95 px-6 backdrop-blur"><div className="lg:hidden"><Brand /></div><div className="hidden text-xs text-white/25 lg:block">NEURONBRIGHT / AI GOVERNANCE</div><div className="flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-xs text-white/60">Acme Corporation</p><p className="text-[10px] text-white/25">Enterprise</p></div><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dc6b27]/15 text-xs font-semibold text-[#dc6b27]">AC</div></div></header>
        <main>{children}</main>
      </div>
    </div>
  );
}
