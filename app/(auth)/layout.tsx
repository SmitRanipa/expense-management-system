import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Background (Aceternity-ish vibe) */}
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/25 via-fuchsia-500/20 to-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-[-200px] right-[-200px] h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-sky-500/15 to-indigo-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(100,116,139,0.18)_1px,transparent_0)] [background-size:26px_26px] opacity-40" />
        </div>

        <div className="relative w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
