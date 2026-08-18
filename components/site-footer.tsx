import Link from "next/link";

const links = [
  ["How it works", "/how-it-works"],
  ["Guide", "/guide"],
  ["Why AI governance?", "/why-ai-governance"],
  ["Pricing", "/pricing"],
  ["Security", "/security"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070707] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="font-semibold tracking-tight">
              NEURON<span className="text-[#dc6b27]">BRIGHT</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/30">
              AI governance infrastructure for organisations that need to know what is happening, what should happen and what can be proved.
            </p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-white/20">Birmingham, UK</p>
          </div>
          <div className="flex flex-wrap content-start gap-x-7 gap-y-4 md:justify-end">
            {links.map(([label, href]) => <Link key={href} href={href} className="text-xs text-white/35 transition-colors hover:text-white">{label}</Link>)}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-[10px] text-white/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/privacy" className="hover:text-white/50">Privacy</Link><Link href="/terms" className="hover:text-white/50">Terms</Link></div>
          <div className="flex flex-col gap-2 sm:items-end"><span>© {new Date().getFullYear()} NEURONBRIGHT. All rights reserved.</span><span>General information only — not legal advice.</span></div>
        </div>
      </div>
    </footer>
  );
}
