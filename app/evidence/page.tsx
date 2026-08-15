import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  Search,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { evidenceItems } from "@/lib/mock-data";

export default function EvidencePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px] px-6 py-8 xl:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#dc6b27]">
            Governance
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Evidence Centre
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Evidence collected and verified across your AI estate.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <FileCheck2
              size={18}
              className="text-[#dc6b27]"
            />

            <p className="mt-5 text-[9px] uppercase tracking-[0.15em] text-white/20">
              Total evidence
            </p>

            <p className="mt-2 text-3xl font-semibold">
              1,842
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <CheckCircle2
              size={18}
              className="text-[#dc6b27]"
            />

            <p className="mt-5 text-[9px] uppercase tracking-[0.15em] text-white/20">
              Verified
            </p>

            <p className="mt-2 text-3xl font-semibold">
              1,725
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5">
            <Clock3
              size={18}
              className="text-amber-400"
            />

            <p className="mt-5 text-[9px] uppercase tracking-[0.15em] text-white/20">
              Pending
            </p>

            <p className="mt-2 text-3xl font-semibold">
              117
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-3">
          <Search
            size={16}
            className="text-white/25"
          />

          <input
            placeholder="Search evidence..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
          />

          <span className="hidden text-[10px] text-white/20 sm:block">
            1,842 records
          </span>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0b0b0b]">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-white/[0.08] bg-white/[0.015] text-[9px] uppercase tracking-[0.15em] text-white/25">
              <tr>
                <th className="px-5 py-4">
                  Evidence
                </th>

                <th className="px-5 py-4">
                  AI system
                </th>

                <th className="px-5 py-4">
                  Source
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Collected
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.07]">
              {evidenceItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.025]"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <FileCheck2
                        size={16}
                        className="text-[#dc6b27]"
                      />

                      <div>
                        <p className="font-medium text-white/75">
                          {item.name}
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          {item.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-white/50">
                    {item.system}
                  </td>

                  <td className="px-5 py-5 text-white/40">
                    {item.source}
                  </td>

                  <td className="px-5 py-5">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-5 py-5 text-white/35">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
