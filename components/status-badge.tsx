type Status =
  | "Healthy"
  | "Review"
  | "Verified"
  | "Pending"
  | "Low"
  | "Medium"
  | "High";

export function StatusBadge({
  status,
}: {
  status: Status;
}) {
  const styles: Record<Status, string> = {
    Healthy:
      "border-[#dc6b27]/20 bg-[#dc6b27]/10 text-[#dc6b27]",

    Review:
      "border-amber-400/20 bg-amber-400/10 text-amber-400",

    Verified:
      "border-[#dc6b27]/20 bg-[#dc6b27]/10 text-[#dc6b27]",

    Pending:
      "border-amber-400/20 bg-amber-400/10 text-amber-400",

    Low:
      "border-white/10 bg-white/[0.04] text-white/60",

    Medium:
      "border-[#dc6b27]/20 bg-[#dc6b27]/10 text-[#dc6b27]",

    High:
      "border-red-400/20 bg-red-400/10 text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
