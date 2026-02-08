import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Trust<span className="text-[var(--accent)]">Builds</span>
              <span className="text-[var(--muted)]">.gg</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--muted)] hover:text-white transition-colors"
            >
              Builds
            </Link>
            <Link
              href="/budget"
              className="text-sm font-medium text-[var(--muted)] hover:text-white transition-colors"
            >
              Budget Builder
            </Link>
            <Link
              href="/upgrade"
              className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
            >
              Upgrade Advisor
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--muted)] hover:text-white transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-[var(--muted)] hover:text-white transition-colors"
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs text-[var(--muted)]">
              Prices updated weekly
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
