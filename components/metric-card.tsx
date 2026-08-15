import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0b0b0b] p-5 transition-colors hover:border-[#dc6b27]/20">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
          {label}
        </p>

        {icon && (
          <div className="text-[#dc6b27]/70">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>

      <p className="mt-2 text-xs text-white/35">
        {detail}
      </p>
    </div>
  );
}
